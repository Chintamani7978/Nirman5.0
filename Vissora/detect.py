import face_recognition
import cv2
import core
import os
from core import anv

scale_factor = 1
v = 0
def detect(val,scale):
    global v
    scale_factor = scale
    known_face_encodings = []
    dt = val
    for i in dt:
        print(f"faces/{i}.jpg")
        my_image = face_recognition.load_image_file(f"19.jpg")
        my_face_encodings = face_recognition.face_encodings(my_image)
        if len(my_face_encodings) == 0:
            raise Exception("No face found in 'me.jpg'!")
        my_face_encoding = my_face_encodings[0]
        known_face_encodings.append(my_face_encoding)

    photos = os.listdir("faces")
    for k in photos:
        frame = cv2.imread(f"faces/{k}")
        if frame is None:
            raise Exception("Could not read 'img.jpg'!")
        small_frame = cv2.resize(frame, (0, 0), fx=scale_factor, fy=scale_factor)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            m = False
            for i,j in enumerate(dt):
                face_distance = face_recognition.face_distance([known_face_encodings[i]], face_encoding)[0]
                print(k.replace(".jpg",""), face_distance)
