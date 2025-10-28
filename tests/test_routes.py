import unittest
from app.server import create_app

class TestRoutes(unittest.TestCase):
    def setUp(self):
        self.app = create_app()

    def test_landing_page(self):
        environ = {'PATH_INFO': '/', 'REQUEST_METHOD': 'GET'}
        start_response_calls = []
        def start_response(status, headers):
            start_response_calls.append((status, headers))
        response = self.app(environ, start_response)
        self.assertEqual(start_response_calls[0][0], '200 OK')
        html = b''.join(response).decode('utf-8')
        self.assertIn('Welcome to Seigr.net', html)

    def test_static_file(self):
        environ = {'PATH_INFO': '/static/css/main.css', 'REQUEST_METHOD': 'GET'}
        start_response_calls = []
        def start_response(status, headers):
            start_response_calls.append((status, headers))
        response = self.app(environ, start_response)
        self.assertEqual(start_response_calls[0][0], '200 OK')

    def test_404(self):
        environ = {'PATH_INFO': '/nonexistent', 'REQUEST_METHOD': 'GET'}
        start_response_calls = []
        def start_response(status, headers):
            start_response_calls.append((status, headers))
        response = self.app(environ, start_response)
        self.assertEqual(start_response_calls[0][0], '404 Not Found')