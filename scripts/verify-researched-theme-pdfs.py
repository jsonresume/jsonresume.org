"""Inspect generated theme PDFs with Poppler and render page contact sheets.

Run after verify-researched-themes.ts. Requires Pillow and Poppler.
"""
import json
import math
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor

from PIL import Image, ImageDraw


root = Path('output/theme-portfolio' if '--portfolio' in sys.argv else 'output/researched-themes')
expected = {
    'basics': 'Jane Developer', 'work': 'Senior Software Engineer',
    'projects': 'Open Source UI Library', 'education': 'University of California',
    'skills': 'PostgreSQL', 'certificates': 'Certified Kubernetes Administrator',
    'volunteer': 'Code for America', 'awards': 'Top Contributor Award',
    'publications': 'Scaling Microservices Without Losing Your Mind',
    'languages': 'Spanish', 'interests': 'Community Building',
    'references': 'Sarah Johnson',
}
selected = next((arg.split('=', 1)[1].split(',') for arg in sys.argv if arg.startswith('--themes=')), None)

def check_folder(folder):
    results = []
    tiles = []
    for pdf in sorted(folder.glob('*.pdf')):
        issues = []
        extracted = subprocess.check_output(['pdftotext', '-raw', str(pdf), '-'], text=True)
        normalised = re.sub(r'\s+', '', extracted).casefold()
        if pdf.name.startswith('complete'):
            for section, sentinel in expected.items():
                if re.sub(r'\s+', '', sentinel).casefold() not in normalised:
                    issues.append(f'Missing {section}: {sentinel}')
        elif pdf.name.startswith('regional'):
            if 'regional-sentinel' not in normalised:
                issues.append('Missing regional project')
        else:
            for index in range(1, 13):
                if f'dense-sentinel-{index}' not in normalised:
                    issues.append(f'Missing dense entry {index}')
        # Poppler supplies each word's actual PDF coordinates. Parsing the
        # bounding-box stream avoids reconstructing thousands of glyph objects.
        bbox = subprocess.check_output(['pdftotext', '-bbox', str(pdf), '-'])
        page_nodes = [node for node in ET.fromstring(bbox).iter()
                      if node.tag.endswith('}page')]
        for number, page in enumerate(page_nodes, 1):
            words = [node for node in page.iter() if node.tag.endswith('}word')]
            if sum(len(word.text or '') for word in words) < 15:
                issues.append(f'Nearly blank page {number}')
            width, height = float(page.attrib['width']), float(page.attrib['height'])
            if any(float(word.attrib['xMin']) < 10 or float(word.attrib['xMax']) > width - 10
                   or float(word.attrib['yMin']) < 10 or float(word.attrib['yMax']) > height - 10
                   for word in words):
                issues.append(f'Content outside printable bounds on page {number}')
        pages = len(page_nodes)
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
    return results

if __name__ == '__main__':
    folders = [folder for folder in sorted(root.iterdir()) if folder.is_dir() and folder.name != 'review' and (not selected or folder.name in selected)]
    results = []
    with ProcessPoolExecutor(max_workers=2) as pool:
        for batch in pool.map(check_folder, folders):
            results.extend(batch)
    (root / ('pdf-results-pilot.json' if selected else 'pdf-results.json')).write_text(json.dumps(results, indent=2))
    failures = [result for result in results if result['issues']]
    print(f'{len(results)} PDFs, {sum(result["pages"] for result in results)} pages, {len(failures)} with issues.')
    if failures:
        print(json.dumps(failures, indent=2))
        raise SystemExit(1)
