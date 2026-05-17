import os
import json
from PIL import Image, ImageOps

# Source and destination directories
SRC_DIR = r"c:\Users\Pratheek Madupu\OneDrive\Desktop\prinstan\gallary"
PUBLIC_DIR = r"c:\Users\Pratheek Madupu\OneDrive\Desktop\prinstan\public\gallery"
OPTIMIZED_DIR = os.path.join(PUBLIC_DIR, "optimized")
THUMBNAILS_DIR = os.path.join(PUBLIC_DIR, "thumbnails")
DATA_DIR = r"c:\Users\Pratheek Madupu\OneDrive\Desktop\prinstan\src\data"
JSON_OUTPUT = os.path.join(DATA_DIR, "gallery.json")

# Ensure directories exist
os.makedirs(OPTIMIZED_DIR, exist_ok=True)
os.makedirs(THUMBNAILS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# List of professional agricultural titles
TITLES = [
    "Field Evaluation & Diagnostics",
    "Farmer Training Workshop",
    "Crop Nutrition Assessment",
    "Soil Health Analysis",
    "Sustainable Crop Solutions",
    "Dealer Network Summit",
    "Modern Irrigation Studies",
    "Pest & Disease Management",
    "High-Yield Crop Trials",
    "Quality Control Testing",
    "Foliar Spray Application",
    "Farmer Interaction Meeting",
    "Product Demo in Field",
    "Bio-Stimulant Field Trial",
    "Paddy Field Monitoring",
    "Micro-Nutrient Demonstration",
    "Empowering Rural Farmers",
    "Agronomist Site Inspection",
    "Harvest Quality Review",
    "Innovative Farming Practices",
    "Prinstan Product Application",
    "Healthy Crop Canopy",
    "Vegetable Crop Protection",
    "Wheat Field Development",
    "Soil Amendment Application",
    "Root System Development",
    "Community Farmers Meet",
    "Cotton Crop Protection",
    "Eco-Friendly Farming Methods",
    "Active Field Discussion"
]

CATEGORIES = [
    "Field Trials",
    "Farmer Meetings",
    "Crop Care",
    "Dealer Network",
    "Product Demos"
]

def optimize_image(filename, index):
    src_path = os.path.join(SRC_DIR, filename)
    base_name, _ = os.path.splitext(filename)
    dest_name = f"{base_name.lower()}.jpg"
    
    opt_path = os.path.join(OPTIMIZED_DIR, dest_name)
    thumb_path = os.path.join(THUMBNAILS_DIR, dest_name)
    
    # Check if already processed to save time
    if os.path.exists(opt_path) and os.path.exists(thumb_path) and os.path.getsize(opt_path) > 0:
        print(f"Skipping {filename} (already optimized)...")
        title = TITLES[index % len(TITLES)]
        category = CATEGORIES[index % len(CATEGORIES)]
        return {
            "id": base_name,
            "title": f"{title} ({base_name})",
            "category": category,
            "url": f"/gallery/optimized/{dest_name}",
            "thumbnailUrl": f"/gallery/thumbnails/{dest_name}",
            "type": "image"
        }
        
    try:
        with Image.open(src_path) as img:
            # Fix orientation based on EXIF data
            img = ImageOps.exif_transpose(img)
            
            # Convert to RGB if in other modes
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            # Create optimized version (max 1600px)
            opt_img = img.copy()
            opt_img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            opt_img.save(opt_path, "JPEG", quality=85, progressive=True)
            
            # Create thumbnail version (max 450px)
            thumb_img = img.copy()
            thumb_img.thumbnail((450, 450), Image.Resampling.LANCZOS)
            thumb_img.save(thumb_path, "JPEG", quality=75, progressive=True)
            
            print(f"Processed {filename} -> Optimized & Thumbnail created.")
            
            title = TITLES[index % len(TITLES)]
            category = CATEGORIES[index % len(CATEGORIES)]
            return {
                "id": base_name,
                "title": f"{title} ({base_name})",
                "category": category,
                "url": f"/gallery/optimized/{dest_name}",
                "thumbnailUrl": f"/gallery/thumbnails/{dest_name}",
                "type": "image"
            }
    except Exception as e:
        print(f"Error processing {filename}: {e}")
        return None

def main():
    # List and sort all images in the gallary directory
    files = [f for f in os.listdir(SRC_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    files.sort()
    
    print(f"Found {len(files)} images to process.")
    
    gallery_data = []
    for idx, filename in enumerate(files):
        print(f"[{idx+1}/{len(files)}] Processing {filename}...")
        meta = optimize_image(filename, idx)
        if meta:
            gallery_data.append(meta)
            
    # Save metadata JSON
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(gallery_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully processed {len(gallery_data)} images. Metadata saved to {JSON_OUTPUT}")

if __name__ == "__main__":
    main()
