#!/usr/bin/env python3

# Importing the required libraries


from swift_msgs.msg import SwiftMsgs
from geometry_msgs.msg import PoseArray
from controller_msg.msg import PIDTune
from error_msg.msg import Error
import rclpy
from rclpy.node import Node


class Swift_Pico(Node):
	def __init__(self):
		super().__init__('pico_controller')  # initializing ros node with name pico_controller

		# This corresponds to your current position of drone. This value must be updated in your whycon callback
		# [x,y,z]
		self.current_state = [0,0,0]




		# This corresponds to the setpoint you want the drone to reach or hold
		# [x_desired_state, y_desired_state, z_desired_state]
		self.desired_state = [-7 ,5, 26]  # whycon marker at the position of the drone given in the scene. Make the whycon marker associated with position_to_hold drone renderable and make changes accordingly




		# Declaring a cmd of message type swift_msgs and initializing values
		self.cmd = SwiftMsgs()
		self.cmd.rc_roll = 1500
		self.cmd.rc_pitch = 1500
		self.cmd.rc_yaw = 1500
		self.cmd.rc_throttle = 1500

		#initial setting of Kp, Kd and ki for [roll, pitch, throttle]. eg: self.Kp[2] corresponds to Kp value in throttle axis
		#after tuning and computing corresponding PID parameters, change the parameters

		self.Kp = [0,0,0]
		self.Ki = [0,0,0]
		self.Kd = [0,0,0]
		self.error = [0.0,0.0,0.0]  # error in each axis [roll, pitch, throttle]
		self.kp_error = [0.0,0.0,0.0]  # proportional error in each axis [roll, pitch, throttle]
		self.prev_values = [0.0,0.0,0.0]  # previous error in each axis [roll, pitch, throttle]
		self.diff_values = [0.0,0.0,0.0]  # differential error in each axis [roll, pitch, throttle]
		self.sum_values = [0.0,0.0,0.0]  # integral error in each axis [roll, pitch, throttle]
		self.min_values = [1000,1000,1000]  # min values for roll, pitch, throttle
		self.max_values = [2000,2000,2000]  # max values for roll, pitch, throttle
		self.out_roll = 0.0
		self.out_pitch = 0.0
		self.out_altitude = 0.0

		
	
		self.sample_time = 0.033  # in seconds

		# Publishing /drone_command, /pid_error
		self.command_pub = self.create_publisher(SwiftMsgs, '/drone_command', 10)
		self.pos_error_pub = self.create_publisher(Error, '/pid_error', 10)
-
	

		# Subscribing to /whycon/poses, /throttle_pid, /pitch_pid, roll_pid
		self.create_subscription(PoseArray, "/whycon/poses", self.whycon_callback, 1)
		self.create_subscription(PIDTune, "/throttle_pid", self.altitude_set_pid, 1)
		self.create_subscription(PIDTune, "/pitch_pid", self.pitch_set_pid, 1)
		self.create_subscription(PIDTune, "/roll_pid", self.roll_set_pid, 1)
	


		
		self.arm()  

		self.create_timer(self.sample_time, self.pid)

		

	def disarm(self):
		self.cmd.rc_roll = 1000
		self.cmd.rc_yaw = 1000
		self.cmd.rc_pitch = 1000
		self.cmd.rc_throttle = 1000
		self.cmd.rc_aux4 = 1000
		self.command_pub.publish(self.cmd)
		

	def arm(self):
		self.disarm()
		self.cmd.rc_roll = 1500
		self.cmd.rc_yaw = 1500
		self.cmd.rc_pitch = 1500
		self.cmd.rc_throttle = 1500
		self.cmd.rc_aux4 = 2000
		self.command_pub.publish(self.cmd)  # Publishing /drone_command


	# Whycon callback function
	# The function gets executed each time when /whycon node publishes /whycon/poses 
	def whycon_callback(self, msg):
		self.current_state[0] = msg.poses[0].position.x
		self.current_state[1] = msg.poses[0].position.y
		self.current_state[2] = msg.poses[0].position.z

def main(args=None):
	rclpy.init(args=args)
	swift_pico = Swift_Pico()
 
	try:
		rclpy.spin(swift_pico)
	except KeyboardInterrupt:
		swift_pico.get_logger().info('KeyboardInterrupt, shutting down.\n')
	finally:
		swift_pico.destroy_node()
		rclpy.shutdown()


if __name__ == '__main__':
	main()