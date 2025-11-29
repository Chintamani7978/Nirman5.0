'''
import os
import shutil
import random
from tqdm import tqdm

# Path to your extracted Dog Emotion dataset
SOURCE_DIR = r"C:\\emotion\\Dog Emotion"  # 👈 change this path
DEST_DIR = "dataset"
VAL_SPLIT = 0.2  # 20% validation

# Create destination folders
classes = ['angry', 'happy', 'relaxed', 'sad']

for split in ['train', 'val']:
    for cls in classes:
        os.makedirs(os.path.join(DEST_DIR, split, cls), exist_ok=True)

# Split and copy files
for cls in classes:
    src_folder = os.path.join(SOURCE_DIR, cls)
    all_images = [f for f in os.listdir(src_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    random.shuffle(all_images)

    val_size = int(len(all_images) * VAL_SPLIT)
    val_images = all_images[:val_size]
    train_images = all_images[val_size:]

    print(f"\nClass '{cls}': {len(train_images)} train, {len(val_images)} val")

    for img in tqdm(train_images, desc=f"Copying {cls} train"):
        shutil.copy(os.path.join(src_folder, img), os.path.join(DEST_DIR, 'train', cls, img))

    for img in tqdm(val_images, desc=f"Copying {cls} val"):
        shutil.copy(os.path.join(src_folder, img), os.path.join(DEST_DIR, 'val', cls, img))

print("\n✅ Data preparation complete!")
'''
'''
import os
import shutil
import random
from tqdm import tqdm

# ---- CONFIG ----
source_root = r"C:\\emotion\\master_disease_dataset"      # your current dataset
target_root = r"C:\\emotion\\dog_disease_yolo_dataset"    # new split dataset path
split_ratio = 0.8                                       # 80% train / 20% val
random.seed(42)                                         # reproducible splits

# Supported image types
IMG_EXT = ('.jpg', '.jpeg', '.png', '.bmp')

# Create output structure
for split in ['train', 'val']:
    os.makedirs(os.path.join(target_root, split), exist_ok=True)

# --- SPLITTING ---
for cls_name in tqdm(sorted(os.listdir(source_root)), desc="Processing classes"):
    cls_path = os.path.join(source_root, cls_name)
    if not os.path.isdir(cls_path):
        continue

    # Get image list
    images = [f for f in os.listdir(cls_path) if f.lower().endswith(IMG_EXT)]
    random.shuffle(images)

    # Split
    split_idx = int(len(images) * split_ratio)
    train_imgs = images[:split_idx]
    val_imgs = images[split_idx:]

    # Create class subfolders
    for split in ['train', 'val']:
        os.makedirs(os.path.join(target_root, split, cls_name), exist_ok=True)

    # Copy images
    for img_name in train_imgs:
        shutil.copy2(os.path.join(cls_path, img_name),
                     os.path.join(target_root, 'train', cls_name, img_name))
    for img_name in val_imgs:
        shutil.copy2(os.path.join(cls_path, img_name),
                     os.path.join(target_root, 'val', cls_name, img_name))

print("\n✅ Dataset successfully split and organized!")
print(f"Train & Val sets created at: {target_root}")
'''
'''
import os
import shutil
from sklearn.model_selection import train_test_split

# Paths
src_root = r"C:\\emotion\\data"  # original dataset
dest_root = r"C:\\emotion\\cat_disease_yolo_dataset"

# Ensure folders exist
os.makedirs(dest_root, exist_ok=True)
train_dir = os.path.join(dest_root, "train")
val_dir = os.path.join(dest_root, "val")
os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)

# Collect only cat folders
cat_folders = [f for f in os.listdir(src_root) if "Cat" in f]

for folder in cat_folders:
    class_name = folder.replace(" in Cat", "").strip()
    src_path = os.path.join(src_root, folder)
    images = [os.path.join(src_path, f) for f in os.listdir(src_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    # Split 80-20
    train_imgs, val_imgs = train_test_split(images, test_size=0.2, random_state=42)
    
    # Create class folders
    os.makedirs(os.path.join(train_dir, class_name), exist_ok=True)
    os.makedirs(os.path.join(val_dir, class_name), exist_ok=True)
    
    # Copy files
    for img in train_imgs:
        shutil.copy(img, os.path.join(train_dir, class_name))
    for img in val_imgs:
        shutil.copy(img, os.path.join(val_dir, class_name))
    
    print(f"✅ Processed {class_name}: {len(train_imgs)} train / {len(val_imgs)} val")

print("\n🎯 Cat disease dataset ready at:", dest_root)
'''
'''
import os
import shutil
import random

# ==== CONFIG ====
source_dir = r"C:\\emotion\\primary"     # your current dataset folder
target_dir = r"C:\\emotion\\baby_emotion_dataset"          # new split folder
split_ratio = 0.8  # 80% train, 20% val

# ==== MAKE FOLDERS ====
for split in ["train", "val"]:
    for cls in os.listdir(source_dir):
        os.makedirs(os.path.join(target_dir, split, cls), exist_ok=True)

# ==== SPLIT FILES ====
for cls in os.listdir(source_dir):
    class_path = os.path.join(source_dir, cls)
    if not os.path.isdir(class_path):
        continue

    images = [f for f in os.listdir(class_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    random.shuffle(images)

    split_index = int(len(images) * split_ratio)
    train_images = images[:split_index]
    val_images = images[split_index:]

    # Move files
    for img in train_images:
        shutil.copy(os.path.join(class_path, img), os.path.join(target_dir, "train", cls, img))
    for img in val_images:
        shutil.copy(os.path.join(class_path, img), os.path.join(target_dir, "val", cls, img))

print("\n✅ Baby Emotion Dataset split completed successfully!")
print(f"Train & Val folders created at: {target_dir}")
'''
'''
import os
import shutil

# ---- Paths ----
source_dataset = r"C:\\emotion\\Skin Lesion Dataset"          # update with your path
target_root = r"C:\\emotion\\baby_disease_base_dataset"       # unified dataset folder

# Classes to include
disease_classes = ["Chickenpox", "Cowpox", "HFMD", "Measles", "Monkeypox", "Healthy"]

# Create target folders
for cls in disease_classes:
    os.makedirs(os.path.join(target_root, "Normal" if cls.lower()=="healthy" else cls), exist_ok=True)

# Merge images from train, val, and test
splits = ["train", "val", "test"]

for split in splits:
    split_path = os.path.join(source_dataset, split)
    if not os.path.exists(split_path):
        print(f"⚠️ {split_path} not found, skipping.")
        continue

    for cls in disease_classes:
        src_folder = os.path.join(split_path, cls)
        dest_folder = os.path.join(target_root, "Normal" if cls.lower()=="healthy" else cls)

        if not os.path.exists(src_folder):
            print(f"⚠️ Skipping {src_folder} (not found)")
            continue

        for root, _, files in os.walk(src_folder):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.webp')):
                    shutil.copy(os.path.join(root, file), dest_folder)

        print(f"✅ Copied {cls} from {split}")

print("\n🎯 Skin Lesion Dataset successfully merged into baby_disease_base_dataset!")
'''
'''
import os
import shutil
from sklearn.model_selection import train_test_split

# === CONFIG ===
base_dir = r"C:\emotion\baby_disease_final\skin_disease_dataset"
output_base = r"C:\emotion\baby_disease_yolo_dataset_model1"
split_ratio = 0.8  # 80% train, 20% val

# Create output directories
train_dir = os.path.join(output_base, "train")
val_dir = os.path.join(output_base, "val")
os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)

# Split each class folder
for cls in os.listdir(base_dir):
    class_path = os.path.join(base_dir, cls)
    if not os.path.isdir(class_path):
        continue

    images = [f for f in os.listdir(class_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    n = len(images)

    if n == 0:
        print(f"⚠️ Skipping '{cls}' — no images found.")
        continue

    # Split only if there are enough images
    test_size = 1 - split_ratio if n > 1 else 0  # if only 1 image, skip split
    train_imgs, val_imgs = train_test_split(images, test_size=test_size, random_state=42)

    os.makedirs(os.path.join(train_dir, cls), exist_ok=True)
    os.makedirs(os.path.join(val_dir, cls), exist_ok=True)

    for img in train_imgs:
        shutil.copy(os.path.join(class_path, img), os.path.join(train_dir, cls, img))
    for img in val_imgs:
        shutil.copy(os.path.join(class_path, img), os.path.join(val_dir, cls, img))

    print(f"✅ {cls}: {len(train_imgs)} train, {len(val_imgs)} val")

print("\n🎉 Split complete!")
print(f"📂 Train folder: {train_dir}")
print(f"📂 Val folder:   {val_dir}")
'''
import os
import shutil
from sklearn.model_selection import train_test_split

# === CONFIG ===
base_dir = r"C:\\emotion\\baby_disease_final\\ear_disease_dataset"
output_dir = r"C:\\emotion\\baby_disease_yolo_dataset_model2"
split_ratio = 0.8  # 80% train, 20% val

os.makedirs(os.path.join(output_dir, "train"), exist_ok=True)
os.makedirs(os.path.join(output_dir, "val"), exist_ok=True)

for cls in os.listdir(base_dir):
    cls_dir = os.path.join(base_dir, cls)
    if not os.path.isdir(cls_dir):
        continue

    images = [f for f in os.listdir(cls_dir)
              if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    if len(images) == 0:
        print(f"⚠️ No images found in {cls_dir}")
        continue

    train_imgs, val_imgs = train_test_split(images, test_size=1 - split_ratio, random_state=42)

    os.makedirs(os.path.join(output_dir, "train", cls), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "val", cls), exist_ok=True)

    for img in train_imgs:
        shutil.copy(os.path.join(cls_dir, img), os.path.join(output_dir, "train", cls, img))
    for img in val_imgs:
        shutil.copy(os.path.join(cls_dir, img), os.path.join(output_dir, "val", cls, img))

print("✅ Ear disease dataset split successfully!")

