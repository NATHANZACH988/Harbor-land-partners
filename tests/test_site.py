import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def parse_page(filename='index.html'):
    page = PageParser()
    page.feed((ROOT / filename).read_text(encoding='utf-8'))
    return page.tags


class SiteStructureTests(unittest.TestCase):
    def test_critical_pages_exist(self):
        for name in ('index.html', 'privacy.html', 'thank-you.html', 'styles.css', 'script.js', 'netlify.toml', 'assets/lighthouse.svg'):
            with self.subTest(path=name):
                self.assertTrue((ROOT / name).is_file())

    def test_local_links_and_images_exist(self):
        for page in ('index.html','privacy.html','thank-you.html'):
            for tag, attrs in parse_page(page):
                for key in ('src','href'):
                    link = attrs.get(key, '')
                    if not link or link.startswith(('#','mailto:','tel:')): continue
                    parsed = urlsplit(link)
                    if parsed.scheme or parsed.netloc: continue
                    path = parsed.path
                    if not path or path == '/': continue
                    file_path = ROOT / path.lstrip('/') if path.startswith('/') else ROOT / path
                    with self.subTest(page=page, path=path):
                        self.assertTrue(file_path.exists(), f'{page}: missing {path}')

    def test_all_local_anchor_targets_exist(self):
        tags = parse_page('index.html')
        ids = {attrs.get('id') for tag, attrs in tags if attrs.get('id')}
        for tag, attrs in tags:
            if tag != 'a' or not attrs.get('href','').startswith('#'): continue
            target = attrs['href'][1:]
            if target: self.assertIn(target, ids, f'Broken anchor #{target}')

    def test_netlify_native_form_is_detectable(self):
        tags = parse_page('index.html')
        forms = [a for t, a in tags if t == 'form' and a.get('name') == 'deal-intake']
        self.assertEqual(len(forms),1)
        form = forms[0]
        self.assertEqual(form.get('method','').upper(), 'POST')
        self.assertEqual(form.get('data-netlify'),'true')
        self.assertEqual(form.get('netlify-honeypot'), 'website')
        self.assertEqual(form.get('action'),'/thank-you.html')
        self.assertTrue(any(t=='input' and a.get('name')=='form-name' and a.get('value')=='deal-intake' for t,a in tags))

    def test_form_fields_map_to_intake_table(self):
        tags = parse_page('index.html')
        fields = {a.get('name') for t,a in tags if t in ('input','select','textarea') and a.get('name')}
        expected = {'fullName','email','phone','role','location','county','apn','acreage','price','listingStatus','timeline','propertyLink','details','consent','website','form-name'}
        self.assertTrue(expected.issubset(fields),expected-fields)
        self.assertIn('Unverified', (ROOT/'docs/INTAKE.md').read_text())

    def test_disclosure_and_privacy_links(self):
        text = (ROOT/'index.html').read_text(encoding='utf-8').lower()
        self.assertIn('not harbor inventory',text)
        self.assertIn('privacy.html',text)
        self.assertIn('not owned or offered',text)

    def test_no_disclosed_secrets_in_source(self):
        # Regression safety guard: public source never includes a raw Airtable PAT or Netlify PAT.
        for name in ('index.html','script.js','config.js','netlify.toml'):
            text = (ROOT/name).read_text(encoding='utf-8')
            self.assertNotIn('pat_',text)
            self.assertNotIn('AIRTABLE_API_KEY=',text)


if __name__ == '__main__':
    unittest.main()
