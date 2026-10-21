from PIL import Image, ImageDraw
from pathlib import Path

root = Path(__file__).resolve().parent.parent
out_dir = root / "public" / "sequence"

for size_name, size in [("desktop", (1920, 1080)), ("mobile", (720, 1280))]:
    folder = out_dir / size_name
    folder.mkdir(parents=True, exist_ok=True)
    for index in range(1, 15 if size_name == "desktop" else 13):
        img = Image.new("RGB", size, (20, 20, 20))
        draw = ImageDraw.Draw(img)
        progress = index / (15 if size_name == "desktop" else 13)
        for y in range(size[1]):
            mix = y / size[1]
            r = int(28 + 120 * mix + 30 * progress)
            g = int(34 + 90 * mix + 25 * progress)
            b = int(36 + 110 * mix)
            draw.line((0, y, size[0], y), fill=(r, g, b))

        for i in range(7):
            x = int(220 + i * 250 + progress * 110)
            y0 = int(size[1] * 0.60)
            h = int(320 + (i % 3) * 110 + progress * 130)
            w = int(120 + (i % 2) * 30)
            draw.rectangle((x, y0 - h, x + w, y0), fill=(45, 45, 48))
            if i % 2 == 0:
                draw.rectangle((x + 18, y0 - h + 18, x + w - 18, y0 - 12), fill=(182, 166, 128))

        draw.rectangle((0, int(size[1] * 0.74), size[0], size[1]), fill=(24, 24, 25))
        for i in range(10):
            x = int(i * 180 + 80 + progress * 80)
            y = int(size[1] * 0.78)
            draw.rectangle((x, y, x + 90, y + 80), fill=(72, 72, 74))
        filename = folder / f"frame_{index:04d}.webp"
        img.save(filename, "WEBP", quality=75)

print(f"Generated placeholder sequence under {out_dir}")
