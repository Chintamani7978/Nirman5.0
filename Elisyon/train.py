'''
# train_emotion_yolo.py
from ultralytics import YOLO

# 1️⃣ Load a pre-trained YOLOv8 classification model (nano version for speed)
model = YOLO("yolov8s-cls.pt")

# 2️⃣ Train on your prepared dataset
results = model.train(
    data="dataset",      # Path to your dataset (must contain train/ and val/ folders)
    epochs=37,           # Number of training rounds
    imgsz=320,           # Resize images to 224x224 for fast training
    batch=16,            # Number of images per batch
    lr0=0.001,           # Initial learning rate
    optimizer="Adam",    # Optimizer choice (Adam is stable)
    project="runs",      # Folder where training results will be saved
    name="dog_emotion_cls",  # Run name
    pretrained=True      # Start from pretrained weights for faster convergence
)

print("\n✅ Training complete!")
print("Best model saved at: runs/classify/dog_emotion_cls/weights/best.pt")
'''
'''
from ultralytics import YOLO
import torch
import os

def main():
    # ---- CONFIG ----
    data_dir = r"C:\\emotion\\dog_disease_yolo_dataset"   # dataset path
    model_name = "yolov8s-cls.pt"                       # using small version
    epochs = 60
    imgsz = 224
    batch = 16                                           # safe for 4GB GPU VRAM

    # ---- DEVICE CHECK ----
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🔥 Using device: {device.upper()} ({torch.cuda.get_device_name(0) if device=='cuda' else 'CPU only'})")

    # ---- TRAIN ----
    model = YOLO(model_name)
    results = model.train(
        data=data_dir,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        lr0=0.001,
        optimizer='Adam',
        patience=10,
        augment=True,
        verbose=True,
        device=device,
        project="dog_disease_cls_runs",
        name="yolov8s_disease_v1_gpu_fixed"
    )

    # ---- EVALUATE ----
    print("\n✅ Training complete! Evaluating on validation set...")
    metrics = model.val(device=device)
    print(metrics)

if __name__ == "__main__":
    torch.multiprocessing.freeze_support()  # <-- critical for Windows
    main()
'''
'''
from ultralytics import YOLO
import torch
import os

def main():
    # ---- CONFIG ----
    data_dir = r"C:\\emotion\\cat_emotion_base_dataset"   # dataset path
    model_name = "yolov8s-cls.pt"                       # using small version
    epochs = 80
    imgsz = 224
    batch = 16                                           # safe for 4GB GPU VRAM

    # ---- DEVICE CHECK ----
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🔥 Using device: {device.upper()} ({torch.cuda.get_device_name(0) if device=='cuda' else 'CPU only'})")

    # ---- TRAIN ----
    model = YOLO(model_name)
    results = model.train(
        data=data_dir,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        lr0=0.001,
        optimizer='Adam',
        patience=20,
        augment=True,
        verbose=True,
        device=device,
        project="cat_emotion_cls_runs",
        name="yolov8s_cat_emotion_v1_gpu"
    )

    # ---- EVALUATE ----
    print("\n✅ Training complete! Evaluating on validation set...")
    metrics = model.val(device=device)
    print(metrics)

if __name__ == "__main__":
    torch.multiprocessing.freeze_support()  # <-- critical for Windows
    main()
'''
'''
from ultralytics import YOLO
import torch
import os

def main():
    # ---- CONFIG ----
    data_dir = r"C:\\emotion\\cat_disease_yolo_dataset"   # dataset path
    model_name = "yolov8s-cls.pt"                       # small version for balanced speed and accuracy
    epochs = 60
    imgsz = 224
    batch = 16                                           # ideal for GTX 1650 4GB GPU

    # ---- DEVICE CHECK ----
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🔥 Using device: {device.upper()} ({torch.cuda.get_device_name(0) if device=='cuda' else 'CPU only'})")

    # ---- TRAIN ----
    model = YOLO(model_name)
    results = model.train(
        data=data_dir,              # Folder with 'train' and 'val'
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        lr0=0.001,
        optimizer='Adam',
        patience=10,                # early stopping if no improvement
        augment=True,
        verbose=True,
        device=device,
        project="cat_disease_cls_runs",
        name="yolov8s_cat_disease_v1_gpu"
    )

    # ---- EVALUATE ----
    print("\n✅ Training complete! Evaluating on validation set...")
    metrics = model.val(device=device)
    print(metrics)

if __name__ == "__main__":
    torch.multiprocessing.freeze_support()  # for Windows compatibility
    main()
'''
'''
from ultralytics import YOLO
import torch
import os

def main():
    # ==== CONFIG ====
    data_dir = r"C:\\emotion\\baby_emotion_dataset"   # path of the train/val folders
    model_name = "yolov8s-cls.pt"                   # YOLOv8 small for good accuracy
    epochs = 60                                     # enough for convergence
    imgsz = 224                                     # standard image size
    batch = 16                                      # fits comfortably in 4GB VRAM

    # ==== DEVICE CHECK ====
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🔥 Using device: {device.upper()} ({torch.cuda.get_device_name(0) if device=='cuda' else 'CPU only'})")

    # ==== TRAIN ====
    model = YOLO(model_name)
    results = model.train(
        data=data_dir,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        lr0=0.001,
        optimizer='Adam',
        patience=10,
        augment=True,
        verbose=True,
        device=device,
        project="baby_emotion_cls_runs",
        name="yolov8s_baby_emotion_v1_gpu"
    )

    # ==== EVALUATE ====
    print("\n✅ Training complete! Evaluating on validation set...")
    metrics = model.val(device=device)
    print(metrics)

if __name__ == "__main__":
    torch.multiprocessing.freeze_support()  # Required for Windows
    main()
'''
'''
from ultralytics import YOLO
import torch
import os

def main():
    # === CONFIG ===
    data_dir = r"C:\\emotion\\baby_disease_yolo_dataset_model1"
    train_dir = data_dir + r"C:\\emotion\\baby_disease_yolo_dataset_model1\\train"
    val_dir = data_dir + r"C:\\emotion\\baby_disease_yolo_dataset_model1\\val"
    model_name = "yolov8s-cls.pt"  # use yolov8m-cls.pt if GPU allows

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🔥 Using device: {device.upper()} ({torch.cuda.get_device_name(0) if device=='cuda' else 'CPU only'})")

    # === Load pre-trained YOLOv8 classification model ===
    model = YOLO(model_name)

    # === Train ===
    model.train(
        data=data_dir,
        epochs=70,
        imgsz=224,
        batch=16,         # reduce to 8 if memory error        
        name="baby_skin_disease_model1",
        lr0=0.001,
        patience=10,
        pretrained=True,
        verbose=True
    )

    print("\n🎉 Training started successfully!")
    print("📊 Logs will be saved inside: runs/classify/baby_skin_disease_model1")

if __name__ == "__main__":
    from multiprocessing import freeze_support
    freeze_support()
    main()
'''
from ultralytics import YOLO
from multiprocessing import freeze_support

def main():
    model = YOLO("yolov8s-cls.pt")  # classification model
    data_dir = r"C:\emotion\baby_disease_yolo_ear_dataset"

    model.train(
        data=data_dir,
        epochs=50,
        imgsz=224,
        batch=32,
        patience=6,
        name="yolov8s_baby_ear_disease_v1",
        project=r"C:\emotion\baby_disease_cls_runs",
        device=0,
        workers=2
    )

if __name__ == "__main__":
    freeze_support()
    main()
