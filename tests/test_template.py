import unittest
from app.template import renderer

class TestTemplate(unittest.TestCase):
    def test_render_template(self):
        html = renderer.render('base.html', {'title': 'Test Title', 'content': '<p>Test content</p>'})
        self.assertIn('Test Title', html)
        self.assertIn('<p>Test content</p>', html)

    def test_render_base(self):
        html = renderer.render_base('landing.html', {'title': 'Test', 'manifesto': '<p>Test manifesto</p>'})
        self.assertIn('Test', html)
        self.assertIn('<p>Test manifesto</p>', html)