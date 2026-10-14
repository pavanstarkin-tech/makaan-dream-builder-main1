from PIL import Image
import os

img_path = "src/assets/logo.jpeg"
out_path = "src/assets/logo.png"

try:
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Check if pixel is dark enough to be considered "black" background
        # R, G, B are less than 40
        if item[0] < 45 and item[1] < 45 and item[2] < 45:
            # Change all black (also shades of black) to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(out_path, "PNG")
    print("Logo successfully processed and saved to:", out_path)
except Exception as e:
    print("Error processing image:", e)
