import unittest
from app.server import ContentCache

class TestContentLoading(unittest.TestCase):
    def test_content_cache_load(self):
        cache = ContentCache()
        self.assertIn('manifesto', cache.cache)
        self.assertIn('toolsets', cache.cache)
        self.assertIn('roadmap', cache.cache)
        self.assertIn('beekeeping', cache.cache)
        self.assertIn('music', cache.cache)

    def test_toolsets_structure(self):
        cache = ContentCache()
        toolsets = cache.cache['toolsets']
        self.assertIsInstance(toolsets, list)
        if toolsets:
            toolset = toolsets[0]
            required_keys = ['title', 'slug', 'short_html', 'detail_path']
            for key in required_keys:
                self.assertIn(key, toolset)

    def test_unique_slugs(self):
        cache = ContentCache()
        toolsets = cache.cache['toolsets']
        slugs = [t['slug'] for t in toolsets]
        self.assertEqual(len(slugs), len(set(slugs)))