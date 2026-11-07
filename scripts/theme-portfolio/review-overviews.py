"""Build labelled contact sheets from real gallery and PDF renders."""
import json
import math
import re
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path('output/theme-portfolio')
review = root / 'review'
review.mkdir(exist_ok=True, parents=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
styles = ['classic', 'minimal', 'modern', 'editorial', 'technical', 'bold', 'creative', 'retro', 'playful']
missing = []
for style in styles:
    rows = json.loads(Path(f'docs/theme-roadmap/{style}.json').read_text())
    for mode in ['gallery', 'print']:
        tiles = []
        for row in rows:
            name = row[0]
            slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            sources = ([Path(f'apps/app/public/img/themes/{slug}.webp')] if mode == 'gallery'
                       else sorted((root / slug).glob('complete-A4-*.png')))
            if not sources or not sources[0].exists():
                missing.append(f'{mode}: {slug}')
                continue
            image = Image.open(sources[0]).convert('RGB')
            width, height = (400, 320) if mode == 'gallery' else (300, 425)
            image.thumbnail((width, height))
            tile = Image.new('RGB', (width + 16, height + 45), '#e5e9ed')
            tile.paste(image, ((tile.width - image.width) // 2, 8))
            ImageDraw.Draw(tile).text((8, height + 18), name, font=font, fill='#17232d')
            tiles.append(tile)
        if not tiles:
            continue
        columns = 4
        sheet = Image.new('RGB', (columns * tiles[0].width, math.ceil(len(tiles) / columns) * tiles[0].height), '#e5e9ed')
        for index, tile in enumerate(tiles):
            sheet.paste(tile, ((index % columns) * tile.width, (index // columns) * tile.height))
        sheet.save(review / f'{style}-{mode}.png')
        print(f'{style}: {len(tiles)}/{len(rows)} {mode} previews', flush=True)
if missing and '--partial' not in sys.argv:
    raise SystemExit('\n'.join(missing))
