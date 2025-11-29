import os
import torch
import numpy as np
from ultralytics import YOLO
from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
from tqdm import tqdm

def main():
    # === CONFIG ===
    model_path = r"C:\emotion\baby_disease_cls_runs\yolov8s_baby_ear_disease_v1\weights\best.pt"  # update if different
    val_dir = r"C:\emotion\baby_disease_yolo_dataset_model2\val"

    # === Load model ===
    model = YOLO(model_path)
    class_names = list(model.names.values())
    print(f"🔍 Evaluating Model on {len(class_names)} Classes...")

    all_preds, all_targets = [], []

    # === Iterate through validation dataset ===
    for class_idx, class_name in enumerate(class_names):
        class_folder = os.path.join(val_dir, class_name)
        if not os.path.isdir(class_folder):
            continue

        image_files = [os.path.join(class_folder, f)
                       for f in os.listdir(class_folder)
                       if f.lower().endswith((".jpg", ".png", ".jpeg"))]

        for img_path in tqdm(image_files, desc=f"Processing {class_name:<25}"):
            result = model(img_path, verbose=False)[0]
            
            # FIX for Probs object (new YOLO version)
            probs = result.probs
            if hasattr(probs, "data"):  # new style
                probs_tensor = probs.data
            elif hasattr(probs, "tensor"):  # fallback
                probs_tensor = probs.tensor
            else:
                probs_tensor = torch.tensor(probs)
            
            pred_idx = int(torch.argmax(probs_tensor))
            all_preds.append(pred_idx)
            all_targets.append(class_idx)

    all_preds = np.array(all_preds)
    all_targets = np.array(all_targets)

    # === Calculate per-class accuracy ===
    print("\n📊 Per-Class Accuracy Results:")
    print("--------------------------------------------------")
    per_class_acc = {}
    for i, name in enumerate(class_names):
        mask = (all_targets == i)
        acc = (all_preds[mask] == i).mean() * 100 if mask.sum() > 0 else 0
        per_class_acc[name] = acc
        print(f"{name:<25} → {acc:.2f}%")

    # === Overall accuracy ===
    overall_acc = (all_preds == all_targets).mean() * 100
    print(f"\n✅ Overall Top-1 Accuracy: {overall_acc:.2f}%")

    # === Confusion Matrix ===
    cm = confusion_matrix(all_targets, all_preds, labels=list(range(len(class_names))))
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=False, cmap="Blues",
                xticklabels=class_names, yticklabels=class_names)
    plt.title("Confusion Matrix - Model 1")
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.tight_layout()
    plt.savefig("confusion_matrix_model1_v3.png")
    plt.close()
    print("\n📁 Confusion matrix saved as: confusion_matrix_model1_v3.png")

    # === Save per-class accuracy to CSV ===
    import pandas as pd
    df = pd.DataFrame(list(per_class_acc.items()), columns=["Class", "Accuracy (%)"])
    df.to_csv("per_class_accuracy_model1.csv", index=False)
    print("📄 Saved per-class accuracy to per_class_accuracy_model1.csv")

    # === Identify weakest performing classes ===
    weakest = sorted(per_class_acc.items(), key=lambda x: x[1])
    print("\n⚠️ Lowest performing 3 classes:")
    for name, acc in weakest[:3]:
        print(f"   {name:<25} → {acc:.2f}%")

if __name__ == "__main__":
    from multiprocessing import freeze_support
    freeze_support()
    main()
