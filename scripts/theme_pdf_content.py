"""Compare printed content without confusing adjacent PDF columns."""
import re
import unicodedata
from html.parser import HTMLParser


def normalise(value):
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', value)).replace('\u00ad', '').casefold()


def contains_content(expected, text):
    marker = re.fullmatch(r'((?:DENSE|NARRATIVE)-SENTINEL-)(\d+)', expected)
    if marker:
        prefix = r'\s*'.join(re.escape(char) for char in marker[1])
        indices = re.findall(prefix + r'\s*(\d+)', unicodedata.normalize('NFKC', text), re.I)
        return marker[2] in indices
    return normalise(expected) in normalise(text)


def column_streams(pages):
    """Follow a horizontal column across pages, excluding neighboring columns.

    PDF paint order can place the other column between the two halves of a
    paragraph that continues onto another page. Keep words intact, and only
    filter by their starting position; no characters or missing words are made up.
    """
    positioned = [(float(word.attrib['xMin']) / float(page.attrib['width']), word.text or '')
                  for page in pages for word in page.iter() if word.tag.endswith('}word')]
    cuts = [0, .18, .25, .33, .42, .5, .58, .66, .75, .82, 1.01]
    for left_index, left in enumerate(cuts[:-1]):
        for right in cuts[left_index+1:]:
            yield ' '.join(text for x, text in positioned if left <= x < right)


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
