import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def remove_black_background(input_path, output_path, threshold=25):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check if the pixel is dark enough to be considered "black" background
        # It's a black background if R, G, and B are all below the threshold
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((255, 255, 255, 0)) # fully transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent logo to {output_path}")

if __name__ == "__main__":
    import os
    base_dir = r"c:\Users\KIRAN\Desktop\makaan-dream-builder- final\makaan-dream-builder-main\makaan-dream-builder-main\src\assets"
    
    # Check if logo.jpeg exists (assumed new logo)
    input_file = os.path.join(base_dir, "logo.jpeg")
    
    if os.path.exists(input_file):
        output_file = os.path.join(base_dir, "logo.png")
        remove_black_background(input_file, output_file, threshold=30)
    else:
        print(f"Error: {input_file} not found")
