from ultralytics import YOLO
import cv2
import tkinter as tk
from tkinter import filedialog

# Load all trained models
dog_emotion_model = YOLO(r"C:\\emotion\\runs\\dog_emotion_cls\\weights\\best.pt")
dog_health_model = YOLO(r"C:\\emotion\\dog_disease_cls_runs\\yolov8s_disease_v1_gpu_fixed\\weights\\best.pt")

cat_emotion_model = YOLO(r"C:\\emotion\\cat_emotion_cls_runs\\yolov8s_cat_emotion_v1_gpu\\weights\\best.pt")
cat_health_model = YOLO(r"C:\\emotion\\cat_disease_cls_runs\\yolov8s_cat_disease_v1_gpu\\weights\\best.pt")


def get_input_image():
    """Ask user to upload image file"""
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(
        title="Select an image file",
        filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.webp")]
    )
    return file_path


def emotion_check(model, animal_type):
    """Handles emotion prediction for Dog or Cat"""
    print(f"\n📸 Choose input mode for {animal_type} emotion detection:")
    print("1 - Upload Photo")
    print("2 - Use Webcam")

    choice = input("Enter 1 or 2: ")

    if choice == "1":
        file_path = get_input_image()
        if file_path:
            results = model(file_path)
            predicted_class = results[0].names[results[0].probs.top1]
            print(f"🐾 Predicted {animal_type} Emotion: {predicted_class}")

            # If the pet seems sad or unwell, suggest health check
            if predicted_class.lower() in ["sad", "angry", "disgusted", "scared"]:
                print(f"\n⚠️ {animal_type} doesn’t seem well. What would you like to do?")
                print("1 - Check Health")
                print("2 - Exit")
                health_choice = input("Enter 1 or 2: ")
                if health_choice == "1":
                    health_check(cat_health_model if animal_type == "Cat" else dog_health_model, animal_type)
                else:
                    print("Exiting...")
            else:
                print(f"{animal_type} seems happy and healthy!")
        else:
            print(" No file selected.")

    elif choice == "2":
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print(" Error: Cannot access webcam.")
            return
        print("🎥 Press 'q' to quit webcam mode.")
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)
            annotated_frame = results[0].plot()
            cv2.imshow(f"{animal_type} Emotion Detection", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
    else:
        print(" Invalid choice. Please enter 1 or 2.")


def health_check(model, animal_type):
    """Handles health/disease prediction"""
    print(f"\n🩺 {animal_type} Health Check:")
    print("1 - Upload Photo of Affected Area")
    print("2 - Use Webcam")

    choice = input("Enter 1 or 2: ")

    if choice == "1":
        file_path = get_input_image()
        if file_path:
            results = model(file_path)
            predicted_class = results[0].names[results[0].probs.top1]
            print(f"🧬 Predicted {animal_type} Disease: {predicted_class}")
        else:
            print("❌ No file selected.")

    elif choice == "2":
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("❌ Error: Cannot access webcam.")
            return
        print("🎥 Press 'q' to quit webcam mode.")
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)
            annotated_frame = results[0].plot()
            cv2.imshow(f"{animal_type} Health Detection", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
    else:
        print("❌ Invalid choice. Please enter 1 or 2.")


def animal_menu(animal_type, emotion_model, health_model):
    """Shows the sub-menu for chosen animal"""
    while True:
        print(f"\n🐾 What would you like to do for your {animal_type}?")
        print("1 - Check Emotion")
        print("2 - Check Health")
        print("3 - Exit")

        choice = input("Enter 1, 2, or 3: ")

        if choice == "1":
            emotion_check(emotion_model, animal_type)
        elif choice == "2":
            health_check(health_model, animal_type)
        elif choice == "3":
            print("👋 Exiting...")
            break
        else:
            print("❌ Invalid option. Try again.")


# ===========================
# MAIN APP FLOW
# ===========================
if __name__ == "__main__":
    print("🐾 Welcome to Pet Emotion & Health Detector 🧠")
    print("1 - Check Dog")
    print("2 - Check Cat")

    animal_choice = input("Enter 1 or 2: ")

    if animal_choice == "1":
        animal_menu("Dog", dog_emotion_model, dog_health_model)
    elif animal_choice == "2":
        animal_menu("Cat", cat_emotion_model, cat_health_model)
    else:
        print("❌ Invalid option. Please restart.")
