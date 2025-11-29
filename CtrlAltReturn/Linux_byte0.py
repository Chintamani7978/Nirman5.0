import sys
import os
import subprocess
def check_root():
    if os.geteuid() != 0:
        print("ERROR: This script requires ROOT permissions.")
        print("Please run with: sudo python3 main.py")
        sys.exit(1)
def scan_devices():
    print("\n--- SCANNING SYSTEM FOR DRIVES ---")
    try:
        cmd = "lsblk -d -o NAME,SIZE,MODEL,TYPE -n"
        output = subprocess.check_output(cmd, shell=True).decode("utf-8").strip()
        devices = []
        if output:
            for line in output.split('\n'):
                if "loop" not in line and "ram" not in line:
                    parts = line.split()
                    dev_name = f"/dev/{parts[0]}"
                    print(f"[FOUND] {dev_name} -> {line}")
                    devices.append(dev_name)
        else:
            print("No external block devices found.")
        return devices
    except Exception as e:
        print(f"Error scanning drives: {e}")
        return []
def simulate_wipe_logic(device):
    print(f"\n--- ANALYZING TARGET: {device} ---")
    try:
        size_cmd = f"blockdev --getsize64 {device}"
        size_bytes = subprocess.check_output(size_cmd, shell=True).decode("utf-8").strip()
        print(f"Total Capacity: {size_bytes} bytes")
        dd_cmd = f"dd if=/dev/zero of={device} bs=4M status=progress"
        print(f"Command Generated: {dd_cmd}")
        print("Backend Logic Status: READY FOR GUI INTEGRATION”)
    except Exception as e:
        print(f"Error analyzing device: {e}")
if __name__ == "__main__":
    check_root()
    drives = scan_devices()
    if drives:
        target = drives[-1] 
        simulate_wipe_logic(target)
    else:
        print("Connect a USB drive to test the logic.")
