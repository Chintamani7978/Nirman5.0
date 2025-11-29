"""
smart_emotion_health_ai.py

Unified CLI app:
- 1: Kids (0-5) -> emotion or health
- 2: Dogs -> emotion or health
- 3: Cats -> emotion or health

Requirements:
- ultralytics YOLO installed
- opencv-python
- tkinter
- torch

Windows note: the script is safe to run; if you run into multiprocessing warnings, use Python's usual __main__ guard (already present).
"""

from ultralytics import YOLO
import cv2
import tkinter as tk
from tkinter import filedialog
import torch
import sys
import time

# -------------------------
# === CONFIG: update these paths to your trained weights ===
# -------------------------
# Dogs
DOG_EMOTION_PATH = r"C:\emotion\runs\dog_emotion_cls\weights\best.pt"
DOG_HEALTH_PATH  = r"C:\emotion\dog_disease_cls_runs\yolov8s_disease_v1_gpu_fixed\weights\best.pt"

# Cats
CAT_EMOTION_PATH = r"C:\emotion\cat_emotion_cls_runs\yolov8s_cat_emotion_v1_gpu\weights\best.pt"
CAT_HEALTH_PATH  = r"C:\emotion\cat_disease_cls_runs\yolov8s_cat_disease_v1_gpu\weights\best.pt"

# Babies (Kids 0-5)
BABY_EMOTION_PATH     = r"C:\emotion\baby_emotion_cls_runs\yolov8s_baby_emotion_v1_gpu\weights\best.pt"  # <- replace with actual baby emotion best.pt
BABY_SKIN_MODEL_PATH  = r"C:\emotion\runs\classify\baby_skin_disease_model13\weights\best.pt"           # Model1 (skin/general)
BABY_EAR_MODEL_PATH   = r"C:\emotion\baby_disease_cls_runs\yolov8s_baby_ear_disease_v1\weights\best.pt"  # Model2 (ear)

# Mild thresholds for baby ear detection (your suggestion: 0.25 - 0.55 => "mild")
MILD_LOW  = 0.25
MILD_HIGH = 0.55

# Webcam settings
WEBCAM_INDEX = 0
WINDOW_WAIT_MS = 1

# -------------------------
# === Load models (lazy load) ===
# -------------------------
print("Loading models (this may take a few seconds)...")
try:
    dog_emotion_model = YOLO(DOG_EMOTION_PATH)
    dog_health_model = YOLO(DOG_HEALTH_PATH)
    cat_emotion_model = YOLO(CAT_EMOTION_PATH)
    cat_health_model = YOLO(CAT_HEALTH_PATH)

    baby_emotion_model = YOLO(BABY_EMOTION_PATH)
    baby_skin_model    = YOLO(BABY_SKIN_MODEL_PATH)
    baby_ear_model     = YOLO(BABY_EAR_MODEL_PATH)
except Exception as e:
    print("⚠️  Error loading one or more models. Check model paths at top of script.")
    raise e

print("✅ Models loaded.")


# -------------------------
# === Helpers ===
# -------------------------
def get_input_image():
    """Open a file-dialog and return selected file path or None."""
    root = tk.Tk()
    root.withdraw()
    file_path = filedialog.askopenfilename(
        title="Select an image file",
        filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.webp")]
    )
    return file_path if file_path else None


def run_webcam_and_infer(model, title="Inference", show_plot=True, single_frame=False):
    """Open webcam, run model on each frame, show annotated frame. Return last result if single_frame True else None."""
    cap = cv2.VideoCapture(WEBCAM_INDEX)
    if not cap.isOpened():
        print("❌ Error: Cannot access webcam.")
        return None

    print("🎥 Webcam started. Press 'q' to quit.")
    last_result = None
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # inference
        results = model(frame)
        res0 = results[0]
        last_result = res0

        if show_plot:
            try:
                annotated = res0.plot()
                cv2.imshow(title, annotated)
            except Exception:
                # fallback: show raw frame
                cv2.imshow(title, frame)

        if single_frame:
            # if user wanted single frame capture (snap), return the latest
            break

        if cv2.waitKey(WINDOW_WAIT_MS) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    return last_result


def get_top_from_result(res):
    """
    Given an ultralytics Classification result (res), return (class_name, confidence_float).
    Handles different result.probs representations.
    """
    try:
        # res.probs may have .data (tensor)
        probs = getattr(res, "probs", None)
        if probs is None:
            return None, 0.0
        # try data tensor first
        p = getattr(probs, "data", None)
        if p is not None:
            # p is a tensor shaped (n_classes,) or (1,n_classes)
            if isinstance(p, torch.Tensor):
                if p.ndim == 2:
                    p = p[0]
                idx = int(torch.argmax(p).item())
                conf = float(p[idx].item())
                name = res.names[idx]
                return name, conf
        # fallback: probs may be a list-like or dict-like
        # Often results[0].probs can be indexed directly
        try:
            arr = list(probs)
            # pick highest
            import numpy as np
            idx = int(np.argmax(arr))
            conf = float(arr[idx])
            name = res.names[idx]
            return name, conf
        except Exception:
            pass

        # final fallback: use top1 attribute if available
        top1 = getattr(probs, "top1", None)
        if top1 is not None:
            # top1 maybe an int index or tuple
            if isinstance(top1, (list, tuple)):
                idx = int(top1[0])
            else:
                idx = int(top1)
            conf = float(getattr(probs, "confidence", 0.0) or 0.0)
            name = res.names[idx]
            return name, conf

    except Exception:
        pass

    # if nothing matched try older pattern: res.probs.top1
    try:
        idx = int(res.probs.top1)
        conf = float(res.probs[idx])
        name = res.names[idx]
        return name, conf
    except Exception:
        pass

    # give a safe default (if names exist)
    try:
        # pick highest via confidences in res.boxes or similar if present
        if hasattr(res, "masks"): pass
    except Exception:
        pass

    return None, 0.0


# -------------------------
# === Baby (kids) health fusion logic ===
# -------------------------
EAR_CLASSES = {"otitis_externa", "otitis_media", "perforation", "wax"}

def baby_health_decision(img_path_or_result):
    """
    img_path_or_result: either image path (str) or ultralytics Result for that image/frame.
    Returns final_text and breakdown tuple.
    """
    # Get skin model result
    if isinstance(img_path_or_result, str):
        r_skin = baby_skin_model(img_path_or_result)[0]
        r_ear  = baby_ear_model(img_path_or_result)[0]
    else:
        # if a Result object was provided (from webcam) we need to re-run both models because that result is for a single model
        r_skin = baby_skin_model(img_path_or_result.plot())[0]  # cheap: convert to image and re-infer (ok for webcam)
        r_ear  = baby_ear_model(img_path_or_result.plot())[0]

    skin_class, skin_conf = get_top_from_result(r_skin)
    ear_class, ear_conf   = get_top_from_result(r_ear)

    # normalize names to strings
    skin_class = str(skin_class) if skin_class is not None else "unknown"
    ear_class  = str(ear_class)  if ear_class  is not None else "unknown"

    final = None
    reason = ""

    # Case: model1 says healthy or normal
    if skin_class.lower() in ["healthy", "normal"]:
        if ear_class in EAR_CLASSES:
            if ear_conf > MILD_HIGH:
                final = ear_class
                reason = f"Strong ear disease predicted by ear model ({ear_conf:.2f})"
            elif MILD_LOW <= ear_conf <= MILD_HIGH:
                final = f"Mild {ear_class}"
                reason = f"Early/mild ear concern (conf {ear_conf:.2f})"
            else:
                final = "Healthy"
                reason = "Both skin model and ear model agree on health (low ear confidence)"
        else:
            final = "Healthy"
            reason = "No skin or ear disease detected"
    else:
        # skin model detected something else (a skin disease)
        if ear_class in EAR_CLASSES:
            if ear_conf > MILD_HIGH:
                final = f"{skin_class} + {ear_class}"
                reason = f"Skin disease + strong ear disease"
            elif MILD_LOW <= ear_conf <= MILD_HIGH:
                final = f"{skin_class} + mild {ear_class}"
                reason = f"Skin disease and mild ear concern"
            else:
                final = skin_class
                reason = "Skin disease detected; ear model low confidence"
        else:
            final = skin_class
            reason = "Skin disease detected; ear model normal"

    breakdown = {
        "skin_model": (skin_class, skin_conf),
        "ear_model" : (ear_class, ear_conf),
    }
    return final, reason, breakdown


# -------------------------
# === Generic emotion & health handlers ===
# -------------------------
def handle_emotion(model, animal_label, use_baby_emotion_for_kids=False):
    """Run emotion detection for chosen species. Gives upload or webcam option."""
    print(f"\n📸 {animal_label} Emotion Detection")
    print("1 - Upload Photo")
    print("2 - Use Webcam")
    choice = input("Enter 1 or 2: ").strip()
    if choice == "1":
        img = get_input_image()
        if not img:
            print("❌ No file selected.")
            return
        r = model(img)[0]
        name, conf = get_top_from_result(r)
        print(f"🐾 Predicted emotion: {name} ({conf:.2f})")
        # If emotion indicates not-well
        if str(name).lower() in ["sad", "angry", "disgusted", "scared", "cry", "crying", "not normal", "not happy"]:
            print("\n⚠️ Seems unwell. Options:")
            print("1 - Check Health")
            print("2 - Exit")
            ch = input("Enter 1 or 2: ").strip()
            if ch == "1":
                # For kids we call baby health (fusion)
                if use_baby_emotion_for_kids:
                    baby_health_flow()
                else:
                    # For pets, call their health model: we expect the caller to pass the right model
                    print("Run health check from the sub-menu.")
            else:
                print("👋 Exiting emotion flow.")
        else:
            print("✅ Seems happy/normal.")
    elif choice == "2":
        # webcam live
        res = run_webcam_and_infer(model, title=f"{animal_label} Emotion Detection", single_frame=False)
        if res:
            name, conf = get_top_from_result(res)
            print(f"🐾 Last prediction: {name} ({conf:.2f})")
            if str(name).lower() in ["sad", "angry", "disgusted", "scared", "cry", "crying", "not normal", "not happy"]:
                print("\n⚠️ Seems unwell. Options:")
                print("1 - Check Health")
                print("2 - Exit")
                ch = input("Enter 1 or 2: ").strip()
                if ch == "1":
                    if use_baby_emotion_for_kids:
                        baby_health_flow()
                    else:
                        print("Run health check from the sub-menu.")
                else:
                    print("👋 Exiting emotion flow.")
    else:
        print("❌ Invalid choice.")


def handle_health(model, animal_label, is_baby=False):
    """Generic health handler; if is_baby True -> use baby fusion."""
    print(f"\n🩺 {animal_label} Health Check")
    print("1 - Upload Photo of affected area")
    print("2 - Use Camera")
    choice = input("Enter 1 or 2: ").strip()
    if choice == "1":
        img = get_input_image()
        if not img:
            print("❌ No file selected.")
            return
        if is_baby:
            final, reason, breakdown = baby_health_decision(img)
            print(f"🎯 FINAL DIAGNOSIS → {final}")
            print(f"💬 Reason: {reason}")
            print(f"🔎 Breakdown: skin={breakdown['skin_model']}, ear={breakdown['ear_model']}")
        else:
            r = model(img)[0]
            name, conf = get_top_from_result(r)
            print(f"🧬 Predicted {animal_label} Disease: {name} ({conf:.2f})")
    elif choice == "2":
        # webcam
        res = run_webcam_and_infer(baby_skin_model if is_baby else model,
                                   title=f"{animal_label} Health Detection",
                                   single_frame=False)
        if not res:
            return
        if is_baby:
            final, reason, breakdown = baby_health_decision(res)
            print(f"🎯 FINAL DIAGNOSIS → {final}")
            print(f"💬 Reason: {reason}")
            print(f"🔎 Breakdown: skin={breakdown['skin_model']}, ear={breakdown['ear_model']}")
        else:
            name, conf = get_top_from_result(res)
            print(f"🧬 Predicted {animal_label} Disease: {name} ({conf:.2f})")
    else:
        print("❌ Invalid choice.")


# -------------------------
# === Sub-menus for each species ===
# -------------------------
def kids_menu():
    while True:
        print("\n👶 Kids (0–5) Menu:")
        print("1 - Check Emotion")
        print("2 - Check Health")
        print("3 - Exit to Main Menu")
        ch = input("Enter 1, 2 or 3: ").strip()
        if ch == "1":
            # use baby emotion model
            handle_emotion(baby_emotion_model, "Kids (0-5)", use_baby_emotion_for_kids=True)
        elif ch == "2":
            baby_health_flow()
        elif ch == "3":
            break
        else:
            print("❌ Invalid option.")


def baby_health_flow():
    # central point to use both skin and ear models
    handle_health(None, "Kids (0-5)", is_baby=True)


def dog_menu():
    while True:
        print("\n🐶 Dog Menu:")
        print("1 - Check Emotion")
        print("2 - Check Health")
        print("3 - Exit to Main Menu")
        ch = input("Enter 1, 2 or 3: ").strip()
        if ch == "1":
            handle_emotion(dog_emotion_model, "Dog")
        elif ch == "2":
            handle_health(dog_health_model, "Dog")
        elif ch == "3":
            break
        else:
            print("❌ Invalid option.")


def cat_menu():
    while True:
        print("\n🐱 Cat Menu:")
        print("1 - Check Emotion")
        print("2 - Check Health")
        print("3 - Exit to Main Menu")
        ch = input("Enter 1, 2 or 3: ").strip()
        if ch == "1":
            handle_emotion(cat_emotion_model, "Cat")
        elif ch == "2":
            handle_health(cat_health_model, "Cat")
        elif ch == "3":
            break
        else:
            print("❌ Invalid option.")


# -------------------------
# === MAIN FLOW ===
# -------------------------
def main():
    print("=========================================")
    print("  Pet & Baby Emotion-Health Detector")
    print("=========================================")
    while True:
        print("\nMain Menu:")
        print("1 - Check for Kids (0-5)")
        print("2 - Check for Dogs")
        print("3 - Check for Cats")
        print("4 - Exit")
        choice = input("Enter 1-4: ").strip()
        if choice == "1":
            kids_menu()
        elif choice == "2":
            dog_menu()
        elif choice == "3":
            cat_menu()
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid option.")


if __name__ == "__main__":
    # Windows-safe multiprocessing support
    try:
        torch.multiprocessing.freeze_support()
    except Exception:
        pass
    main()

