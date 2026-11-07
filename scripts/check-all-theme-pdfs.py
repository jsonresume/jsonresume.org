"""Check every exported page and render compact per-theme visual review sheets."""
import json
import math
import re
import subprocess
import sys
import unicodedata
import xml.etree.ElementTree as ET
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from html.parser import HTMLParser

from PIL import Image, ImageDraw

ROOT = Path('output/all-theme-pdfs')
SELECTED = next((arg.split('=', 1)[1].split(',') for arg in sys.argv if arg.startswith('--themes=')), None)
EXPECTED = {
    'complete': ['Jane Developer', 'Senior Software Engineer', 'PostgreSQL',
                 'Open Source UI Library', 'University of California',
                 'Certified Kubernetes Administrator', 'Code for America',
                 'Top Contributor Award', 'Scaling Microservices Without Losing Your Mind',
                 'Spanish', 'Community Building', 'Sarah Johnson'],
    'dense': [f'DENSE-SENTINEL-{index}' for index in range(1, 13)] + [f'NARRATIVE-SENTINEL-{index}' for index in range(1, 15)],
    'sparse': ['Ada Lovelace'],
    'wrapping': ['Alexandria-Nkemdilim', 'Westhuizen', 'Long content must wrap',
                 'DistributedInternationalAccessibilityInfrastructure' * 4],
    'regional': ['REGIONAL-SENTINEL'],
}


def normalise(value):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', value)).replace('\u00ad', '').casefold()


class DocumentText(HTMLParser):
    """Exclude CSS and structured data, which are not printed document content."""
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.skip, self.parts = 0, []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        if tag == 'body':
            self.skip = 0
        elif tag in ('head', 'script', 'style', 'noscript'):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ('head', 'script', 'style', 'noscript'):
            self.skip = max(0, self.skip - 1)

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def check_folder(folder):
    results, tiles, probes = [], [], {}
    for pdf in sorted(folder.glob('*.pdf')):
        fixture, paper = pdf.stem.rsplit('-', 1)
        issues = []
        extracted = subprocess.check_output(['pdftotext', '-raw', str(pdf), '-'], text=True, stderr=subprocess.DEVNULL)
        text = normalise(extracted)
        html = normalise(''.join(DocumentText((folder / f'{fixture}.html').read_text()).parts))
        for sentinel in EXPECTED[fixture]:
            if sentinel.startswith('NARRATIVE-') and normalise(sentinel) not in html:
                continue
            # A few older designs intentionally omit optional fields. Print
            # must preserve what their renderer actually supplies.
            if fixture in ('complete', 'wrapping') and normalise(sentinel) not in html:
                continue
            if normalise(sentinel) not in text:
                issues.append(f'Missing content: {sentinel}')
        bbox = subprocess.check_output(['pdftotext', '-bbox', str(pdf), '-'], stderr=subprocess.DEVNULL)
        pages = [node for node in ET.fromstring(bbox).iter() if node.tag.endswith('}page')]
        smallest = 100
        heights = {word: [] for word in ('postgresql', 'typescript', 'kubernetes')}
        for number, page in enumerate(pages, 1):
            words = [node for node in page.iter() if node.tag.endswith('}word')]
            if sum(len(word.text or '') for word in words) < (3 if fixture == 'sparse' else 15):
                issues.append(f'Nearly blank page {number}')
            width, height = float(page.attrib['width']), float(page.attrib['height'])
            expected_width, expected_height = (595.28, 841.89) if paper == 'A4' else (612, 792)
            if abs(width - expected_width) > 2 or abs(height - expected_height) > 2:
                issues.append(f'Wrong paper size on page {number}: {width} x {height}')
            outside = [word.text for word in words if float(word.attrib['xMin']) < 10
                       or float(word.attrib['xMax']) > width - 10
                       or float(word.attrib['yMin']) < 10 or float(word.attrib['yMax']) > height - 10]
            if outside:
                issues.append(f'Content outside printable bounds on page {number}: {outside[:6]}')
            for word in words:
                for probe in heights:
                    if probe in (word.text or '').casefold():
                        heights[probe].append(float(word.attrib['yMax']) - float(word.attrib['yMin']))
                if len(word.text or '') > 3:
                    smallest = min(smallest, float(word.attrib['yMax']) - float(word.attrib['yMin']))
        probes[(fixture, paper)] = {key: max(values) for key, values in heights.items() if values}
        if '--render-all' in sys.argv or ('--render' in sys.argv and paper == 'A4' and fixture in ('complete', 'dense', 'regional')):
            prefix = folder / pdf.stem
            for stale in folder.glob(f'{pdf.stem}-*.png'):
                stale.unlink()
            subprocess.run(['pdftoppm', '-scale-to', '700', '-png', str(pdf), str(prefix)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            for path in sorted(folder.glob(f'{pdf.stem}-*.png')):
                image = Image.open(path).convert('RGB')
                image.thumbnail((250, 355))
                tile = Image.new('RGB', (270, 385), '#e5e9ed')
                tile.paste(image, ((270-image.width)//2, 23))
                ImageDraw.Draw(tile).text((8, 5), path.stem, fill='#17232d')
                tiles.append(tile)
        results.append({'theme': folder.name, 'file': pdf.name, 'pages': len(pages),
                        'smallestWordHeight': round(smallest, 2), 'issues': issues})
    for paper in ('A4', 'Letter'):
        regular, wrapping = probes.get(('complete', paper), {}), probes.get(('wrapping', paper), {})
        ratios = [wrapping[key]/value for key, value in regular.items() if key in wrapping and value]
        if len([ratio for ratio in ratios if ratio < 0.8]) >= 2:
            row = next(row for row in results if row['file'] == f'wrapping-{paper}.pdf')
            row['issues'].append('Long content shrank body text by more than 20%')
    for fixture in ('complete', 'dense', 'sparse', 'wrapping'):
        for paper in ('A4', 'Letter'):
            if not (folder / f'{fixture}-{paper}.pdf').exists():
                results.append({'theme': folder.name, 'file': f'{fixture}-{paper}.pdf',
                                'pages': 0, 'issues': ['Missing expected PDF']})
    if tiles:
        columns = min(8, len(tiles))
        sheet = Image.new('RGB', (columns*270, math.ceil(len(tiles)/columns)*385), '#e5e9ed')
        for index, tile in enumerate(tiles):
            sheet.paste(tile, ((index % columns)*270, (index//columns)*385))
        sheet.save(folder / 'print-contact-sheet.png')
    return results


if __name__ == '__main__':
    folders = [folder for folder in sorted(ROOT.iterdir()) if folder.is_dir() and folder.name != 'review'
               and (not SELECTED or folder.name in SELECTED)]
    results = []
    with ProcessPoolExecutor(max_workers=2) as pool:
        for batch in pool.map(check_folder, folders):
            results.extend(batch)
    (ROOT / ('pdf-results-selected.json' if SELECTED else 'pdf-results.json')).write_text(json.dumps(results, indent=2))
    failures = [result for result in results if result['issues']]
    print(json.dumps({'pdfs': len(results), 'pages': sum(r['pages'] for r in results),
                      'failures': len(failures), 'themes': len({r['theme'] for r in failures})}))
    if '--details' in sys.argv:
        print(json.dumps(failures, indent=2))
    sys.exit(bool(failures))
