"""Inspect generated theme PDFs with pdfplumber and render page contact sheets.

Run after verify-researched-themes.ts. Requires pdfplumber, Pillow and Poppler.
"""
import json
import logging
import math
import re
import subprocess
from pathlib import Path

import pdfplumber
from PIL import Image, ImageDraw

logging.getLogger('pdfminer').setLevel(logging.ERROR)

root = Path('output/researched-themes')
expected = {
    'basics': 'Jane Developer', 'work': 'Senior Software Engineer',
    'projects': 'Open Source UI Library', 'education': 'University of California',
    'skills': 'PostgreSQL', 'certificates': 'Certified Kubernetes Administrator',
    'volunteer': 'Code for America', 'awards': 'Top Contributor Award',
    'publications': 'Scaling Microservices Without Losing Your Mind',
    'languages': 'Spanish', 'interests': 'Community Building',
    'references': 'Sarah Johnson',
}
results = []
for folder in sorted(root.iterdir()):
    if not folder.is_dir() or folder.name == 'review':
        continue
    tiles = []
    for pdf in sorted(folder.glob('*.pdf')):
        issues = []
        extracted = subprocess.check_output(['pdftotext', '-raw', str(pdf), '-'], text=True)
        normalised = re.sub(r'\s+', '', extracted).casefold()
        if pdf.name.startswith('complete'):
            for section, sentinel in expected.items():
                if re.sub(r'\s+', '', sentinel).casefold() not in normalised:
                    issues.append(f'Missing {section}: {sentinel}')
        else:
            for index in range(1, 13):
                if f'dense-sentinel-{index}' not in normalised:
                    issues.append(f'Missing dense entry {index}')
        with pdfplumber.open(pdf) as doc:
            for number, page in enumerate(doc.pages, 1):
                chars = [char for char in page.chars if char['text'].strip()]
                if len(chars) < 15:
                    issues.append(f'Nearly blank page {number}')
                if any(char['x0'] < 10 or char['x1'] > page.width - 10
                       or char['top'] < 10 or char['bottom'] > page.height - 10
                       for char in chars):
                    issues.append(f'Content outside printable bounds on page {number}')
            pages = len(doc.pages)
        prefix = folder / pdf.stem
        for old_render in folder.glob(f'{pdf.stem}-*.png'):
            old_render.unlink()
        subprocess.run(['pdftoppm', '-scale-to', '600', '-png', str(pdf), str(prefix)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for image_path in sorted(folder.glob(f'{pdf.stem}-*.png')):
            image = Image.open(image_path).convert('RGB')
            image.thumbnail((250, 355))
            tile = Image.new('RGB', (270, 385), '#e5e9ed')
            tile.paste(image, ((270-image.width)//2, 23))
            ImageDraw.Draw(tile).text((8, 5), image_path.stem, fill='#17232d')
            tiles.append(tile)
        results.append({'theme': folder.name, 'file': pdf.name, 'pages': pages, 'issues': issues})
    if tiles:
        columns = min(6, len(tiles))
        sheet = Image.new('RGB', (columns * 270, math.ceil(len(tiles)/columns) * 385), '#e5e9ed')
        for index, tile in enumerate(tiles):
            sheet.paste(tile, ((index % columns)*270, (index//columns)*385))
        sheet.save(folder / 'print-contact-sheet.png')
    print(f'{folder.name}: PDF content, bounds and page renders checked', flush=True)
(root / 'pdf-results.json').write_text(json.dumps(results, indent=2))
failures = [result for result in results if result['issues']]
print(f'{len(results)} PDFs, {sum(result["pages"] for result in results)} pages, {len(failures)} with issues.')
if failures:
    print(json.dumps(failures, indent=2))
    raise SystemExit(1)
