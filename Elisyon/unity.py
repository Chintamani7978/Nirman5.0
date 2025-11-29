
'''
import os
import shutil
from tqdm import tqdm

# ---- CONFIG ----
source_root = r"C:\\emotion\\Mendely dog skin"   # change path if needed
label_file = os.path.join(source_root, "C:\\emotion\\Mendely dog skin\\image_label.txt")
target_root = r"C:\\emotion\\master_disease_dataset"

# Create output directories
classes_map = {
    "Fungal_infections": "skin_infection",
    "Bacterial_dermatosis": "skin_infection",
    "Hypersensitivity_allergic_dermatosis": "allergic_dermatosis",
    "Healthy": "healthy"
}

for cls in set(classes_map.values()):
    os.makedirs(os.path.join(target_root, cls), exist_ok=True)

# ---- READ LABELS ----
folder_to_label = {}
with open(label_file, "r") as f:
    for line in f.readlines():
        parts = line.strip().split()
        if len(parts) == 2:
            folder_to_label[parts[0]] = parts[1]

print(f"Found {len(folder_to_label)} labeled folders.")

# ---- COPY IMAGES ----
for folder_name, disease_label in tqdm(folder_to_label.items()):
    src_folder = os.path.join(source_root, folder_name)
    if not os.path.isdir(src_folder):
        continue

    # map detailed label to our unified classes
    target_class = classes_map.get(disease_label, None)
    if target_class is None:
        continue

    dest_folder = os.path.join(target_root, target_class)

    for file in os.listdir(src_folder):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            src_path = os.path.join(src_folder, file)
            new_name = f"{folder_name}_{file}"  # avoid collisions
            dst_path = os.path.join(dest_folder, new_name)
            try:
                shutil.copy2(src_path, dst_path)
            except Exception as e:
                print(f"Error copying {src_path}: {e}")

print("\n✅ Dataset successfully reorganized!")
print(f"Check output at: {target_root}")
'''
'''
import os
import shutil
from tqdm import tqdm
import yaml

# ---- CONFIG ----
source_root = r"C:\\emotion\\Dog Disease Detection.v2i.yolov8"   # adjust this path
target_root = r"C:\\emotion\\master_disease_dataset"

# ---- LOAD YAML FOR CLASS MAPPING ----
yaml_path = os.path.join(source_root, "data.yaml")
with open(yaml_path, "r") as f:
    data = yaml.safe_load(f)

class_names = data.get("names", [])
print("Detected classes from YAML:", class_names)

# Create class folders if they don’t exist
for cls in class_names:
    os.makedirs(os.path.join(target_root, cls), exist_ok=True)

# ---- FUNCTION TO COPY IMAGES ----
def process_split(split_name):
    img_dir = os.path.join(source_root, split_name, "images")
    lbl_dir = os.path.join(source_root, split_name, "labels")

    for label_file in tqdm(os.listdir(lbl_dir), desc=f"Processing {split_name}"):
        if not label_file.endswith(".txt"):
            continue
        label_path = os.path.join(lbl_dir, label_file)
        with open(label_path, "r") as lf:
            lines = lf.readlines()

        # Use first label line → assume one disease per image
        if len(lines) == 0:
            continue
        first_class_id = int(lines[0].split()[0])
        class_name = class_names[first_class_id]

        img_name = label_file.replace(".txt", ".jpg")
        img_path = os.path.join(img_dir, img_name)

        # Handle other formats too
        if not os.path.exists(img_path):
            img_path = img_path.replace(".jpg", ".png")
            if not os.path.exists(img_path):
                continue

        dest_path = os.path.join(target_root, class_name, f"{split_name}_{img_name}")
        shutil.copy2(img_path, dest_path)

# ---- RUN FOR TRAIN/VALID/TEST ----
for split in ["train", "valid", "test"]:
    process_split(split)

print("\n✅ All Roboflow disease images have been merged into master_disease_dataset.")
print("Output path:", target_root)
'''
'''
import os
import shutil
from tqdm import tqdm

# ---- CONFIG ----
source_root = r"C:\\emotion\\Dog Skin Disease Dataset.v2i.folder"   # adjust if needed
target_root = r"C:\\emotion\\master_disease_dataset"

# Folder → unified class mapping
class_map = {
    "fungal infection": "skin_infection",
    "bacterial dermatosis": "skin_infection",
    "hypersensitivity dermatitis": "allergic_dermatosis",
    "healthy": "healthy"
}

# Create destination folders if they don’t exist
for cls in set(class_map.values()):
    os.makedirs(os.path.join(target_root, cls), exist_ok=True)

# Function to move all split folders (train/valid/test)
def process_split(split_name):
    split_path = os.path.join(source_root, split_name)
    if not os.path.exists(split_path):
        return

    for folder_name in os.listdir(split_path):
        src_folder = os.path.join(split_path, folder_name)
        if not os.path.isdir(src_folder):
            continue

        unified_label = class_map.get(folder_name.lower().strip(), None)
        if unified_label is None:
            continue

        dest_folder = os.path.join(target_root, unified_label)
        os.makedirs(dest_folder, exist_ok=True)

        for img_file in tqdm(os.listdir(src_folder),
                             desc=f"{split_name} → {unified_label}"):
            if img_file.lower().endswith((".jpg", ".jpeg", ".png")):
                src = os.path.join(src_folder, img_file)
                dst = os.path.join(dest_folder,
                                   f"{split_name}_{folder_name}_{img_file}")
                try:
                    shutil.copy2(src, dst)
                except Exception as e:
                    print(f"Error copying {src}: {e}")

# ---- RUN ----
for split in ["train", "valid", "test"]:
    process_split(split)

print("\n✅ Roboflow Dog Skin Disease dataset successfully merged!")
print("Output:", target_root)
'''
'''
# pip install bing-image-downloader pillow tqdm

from bing_image_downloader import downloader
from tqdm import tqdm
import os

# Path to master dataset
base_dir = r"C:\\emotion\\master_disease_dataset"

# Disease classes to collect
classes = {
    "ear_infection": [
        "dog ear infection",
        "dog otitis externa",
        "dog red ear canal",
        "dog ear discharge infection"
    ],
    "eye_infection": [
        "dog eye infection",
        "dog conjunctivitis",
        "dog red watery eyes",
        "dog eye discharge infection"
    ],
    "injury": [
        "dog injury wound",
        "dog leg injury",
        "dog paw cut",
        "dog bleeding wound"
    ],
    "respiratory_issue": [
        "dog coughing breathing problem",
        "dog nasal discharge",
        "dog kennel cough",
        "dog breathing difficulty"
    ]
}

# Download images per search term
for cls, search_terms in classes.items():
    save_path = os.path.join(base_dir, cls)
    os.makedirs(save_path, exist_ok=True)
    print(f"\n📸 Downloading images for class: {cls}")
    for term in tqdm(search_terms):
        downloader.download(
            term,
            limit=150,  # ~150 per keyword = ~600/class
            output_dir=save_path,
            adult_filter_off=True,
            force_replace=False,
            timeout=60
        )

print("\n✅ Step 1 Done: All images downloaded!")
'''
'''
import os
import shutil

# ---- Paths ----
source_dataset = r"C:\\Users\\pattn\\Downloads\\NJN"  # your NJN dataset path
target_root = r"C:\\emotion\\baby_disease_base_dataset"     # unified dataset folder

# Mapping old folder names to unified labels
folder_mapping = {
    "Jaundice": "Jaundice",
    "Normal": "Normal",
    "Healthy": "Normal"
}

# Create target folders
for label in folder_mapping.values():
    os.makedirs(os.path.join(target_root, label), exist_ok=True)

# Copy images
for src_label, target_label in folder_mapping.items():
    src_path = os.path.join(source_dataset, src_label)
    dest_path = os.path.join(target_root, target_label)

    if not os.path.exists(src_path):
        print(f"⚠️ Skipping: {src_path} not found.")
        continue

    for root, _, files in os.walk(src_path):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.webp')):
                shutil.copy(os.path.join(root, file), dest_path)

    print(f"✅ Copied {src_label} → {target_label}")

print("\n🎯 All NJN dataset images organized successfully!")
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

# --- Paths ---
source_dataset = r"C:\\emotion\\SkinDisNet"                   # your SkinDisNet folder path
target_root = r"C:\\emotion\\baby_disease_base_dataset"       # unified dataset

# Mapping from short codes to full disease names
class_mapping = {
    "AD": "Atopic Dermatitis",
    "CD": "Contact Dermatitis",
    "EC": "Eczema",
    "SC": "Seborrheic Dermatitis",
    "SD": "Stasis Dermatitis",
    "TC": "Tinea Corporis"
}

# Create target folders
for full_name in class_mapping.values():
    os.makedirs(os.path.join(target_root, full_name), exist_ok=True)

# Merge both "Augmented" and "Preprocessed"
subfolders = ["Augmented", "Preprocessed"]

for subfolder in subfolders:
    sub_path = os.path.join(source_dataset, subfolder)
    if not os.path.exists(sub_path):
        print(f"⚠️ {sub_path} not found, skipping.")
        continue

    for short_name, full_name in class_mapping.items():
        src_folder = os.path.join(sub_path, short_name)
        dest_folder = os.path.join(target_root, full_name)

        if not os.path.exists(src_folder):
            print(f"⚠️ Skipping {src_folder} (not found)")
            continue

        for root, _, files in os.walk(src_folder):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.webp')):
                    shutil.copy(os.path.join(root, file), dest_folder)

        print(f"✅ Copied {full_name} from {subfolder}")

print("\n🎯 SkinDisNet successfully merged into baby_disease_base_dataset!")
'''
'''
import os
import pandas as pd
import shutil

# === CONFIG ===
excel_path = r"C:\\emotion\\BabyEar4k\\diagnosis_result.csv"  # it's CSV, not Excel
images_dir = r"C:\\emotion\\BabyEar4k\\images"
output_dir = r"C:\\emotion\\baby_disease_base_dataset"

# label mapping
label_map = {
    "0": "healthy",
    "1": "otitis_media",
    "2": "wax",
    "3": "otitis_externa",
    "4": "perforation"
}

# create output folders
for label in label_map.values():
    os.makedirs(os.path.join(output_dir, label), exist_ok=True)

# === Load CSV ===
df = pd.read_csv(excel_path)

def decode_label(code_str):
    """Extract highest numeric code from a + separated string like 0+1+2"""
    try:
        parts = [int(x) for x in str(code_str).split('+') if x.isdigit()]
        max_code = max(parts) if parts else 0
        return label_map.get(str(max_code), "unknown")
    except:
        return "unknown"

# === Process rows ===
for _, row in df.iterrows():
    for col in ['dictory_L', 'dictory_R']:
        img_name = os.path.basename(str(row[col]))
        img_path = os.path.join(images_dir, img_name)

        if os.path.exists(img_path):
            label_code = row['L_merge'] if col == 'dictory_L' else row['R_merge']
            label = decode_label(label_code)
            dest_dir = os.path.join(output_dir, label)
            shutil.copy(img_path, dest_dir)

print("✅ BabyEar4k dataset organized successfully into labeled folders!")
'''
import os
import shutil

# Source folder (your combined dataset)
source_dir = r"C:\\emotion\\baby_disease_base_dataset"

# Destination folders
skin_dir = r"C:\\emotion\\baby_disease_final\\skin_disease_dataset"
ear_dir = r"C:\\emotion\\baby_disease_final\\ear_disease_dataset"

# Create destination folders if not exist
os.makedirs(skin_dir, exist_ok=True)
os.makedirs(ear_dir, exist_ok=True)

# Define which classes go where
ear_classes = ['otitis_externa', 'otitis_media', 'perforation', 'wax']
skin_classes = [
    'Atopic Dermatitis', 'Chickenpox', 'Contact Dermatitis', 'Cowpox',
    'Eczema', 'HFMD', 'Jaundice', 'Measles', 'Monkeypox',
    'Seborrheic Dermatitis', 'Stasis Dermatitis', 'Tinea Corporis',
    'Normal', 'healthy'
]

# Function to copy safely
def copy_folder(src_folder, dst_folder):
    dst_path = os.path.join(dst_folder, os.path.basename(src_folder))
    os.makedirs(dst_path, exist_ok=True)
    for filename in os.listdir(src_folder):
        src_file = os.path.join(src_folder, filename)
        dst_file = os.path.join(dst_path, filename)
        if os.path.isfile(src_file):
            shutil.copy2(src_file, dst_file)

# Iterate through all folders
for folder in os.listdir(source_dir):
    folder_path = os.path.join(source_dir, folder)
    if not os.path.isdir(folder_path):
        continue

    if folder in ear_classes:
        print(f"🎧 Moving ear class → {folder}")
        copy_folder(folder_path, ear_dir)
    elif folder in skin_classes:
        print(f"🩺 Moving skin class → {folder}")
        copy_folder(folder_path, skin_dir)
    else:
        print(f"⚠️ Skipping unknown folder: {folder}")

print("\n✅ Dataset successfully split into:")
print(f"   Skin dataset: {skin_dir}")
print(f"   Ear dataset: {ear_dir}")

