import unittest
from xml.etree.ElementTree import Element, SubElement
from theme_pdf_content import DocumentText, column_streams, contains_content


class ContentTests(unittest.TestCase):
    def test_entry_one_does_not_match_entry_ten(self):
        self.assertFalse(contains_content('DENSE-SENTINEL-1', 'DENSE-SENTINEL-10'))
        self.assertTrue(contains_content('DENSE-SENTINEL-10', 'DENSE-\nSENTINEL-10'))

    def test_follow_paragraph_across_pages_without_neighboring_column(self):
        pages = [Element('page', width='600'), Element('page', width='600')]
        for page, x, text in [(0, 40, 'NARRATIVE-'), (0, 350, 'Sidebar'), (1, 40, 'SENTINEL-2')]:
            SubElement(pages[page], '{http://www.w3.org/1999/xhtml}word', xMin=str(x)).text = text
        self.assertFalse(contains_content('NARRATIVE-SENTINEL-2', 'NARRATIVE- Sidebar SENTINEL-2'))
        self.assertTrue(any(contains_content('NARRATIVE-SENTINEL-2', stream) for stream in column_streams(pages)))
        self.assertFalse(any(contains_content('NARRATIVE-SENTINEL-3', stream) for stream in column_streams(pages)))

    def test_do_not_treat_structured_data_as_visible_content(self):
        html = '<head><script>Hidden name</script><style>.css{}</style></head><body>Visible &amp; safe</body>'
        self.assertEqual(''.join(DocumentText(html).parts), 'Visible & safe')


if __name__ == '__main__':
    unittest.main()
