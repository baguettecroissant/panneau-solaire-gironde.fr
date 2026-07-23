from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
size = 512
image = Image.new("RGBA", (size, size), "#166534")
draw = ImageDraw.Draw(image)

draw.rounded_rectangle((15, 15, size - 15, size - 15), radius=105, outline="#22c55e", width=10)
draw.ellipse((113, 82, 425, 394), fill="#f0fdf4", outline="#bbf7d0", width=9)
draw.polygon([(135, 335), (384, 109), (329, 342)], fill="#22c55e")
draw.line((126, 399, 376, 132), fill="#b45309", width=21)
draw.arc((92, 120, 348, 413), start=198, end=315, fill="#166534", width=12)

image.resize((180, 180), Image.Resampling.LANCZOS).save(root / "public" / "apple-touch-icon.png", optimize=True)
image.save(root / "public" / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print("Favicon feuille Gironde généré.")
