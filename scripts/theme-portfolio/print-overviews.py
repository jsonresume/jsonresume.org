"""Create labelled overviews from the current PDF audit's rasterized pages."""
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path('output/all-theme-pdfs')
out = root / 'review'
out.mkdir(exist_ok=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
baseline = json.loads((root / 'baseline-results.json').read_text()) if (root / 'baseline-results.json').exists() else []
repaired = {row['theme'] for row in baseline if row['issues']}
themes = sorted(row.name for row in root.iterdir() if row.is_dir() and row.name != 'review')

for mode in ('first', 'continuation'):
    tiles = []
    for theme in themes:
        if mode == 'continuation' and theme not in repaired:
            continue
        pages = sorted((root / theme).glob('complete-A4-*.png'))
        index = 0 if mode == 'first' else 1
        if len(pages) <= index:
            continue
        page = Image.open(pages[index]).convert('RGB')
        page.thumbnail((240, 340))
        tile = Image.new('RGB', (256, 375), '#e5e9ed')
        tile.paste(page, ((256-page.width)//2, 5))
        ImageDraw.Draw(tile).text((8, 350), theme, font=font, fill='#17232d')
        tiles.append(tile)
    for start in range(0, len(tiles), 16):
        batch = tiles[start:start+16]
        sheet = Image.new('RGB', (1024, math.ceil(len(batch)/4)*375), '#e5e9ed')
        for index, tile in enumerate(batch):
            sheet.paste(tile, ((index % 4)*256, (index//4)*375))
        sheet.save(out / f'{mode}-{start//16+1:02d}.png')
    print(f'{mode}: {len(tiles)} current PDF pages in review overviews')
