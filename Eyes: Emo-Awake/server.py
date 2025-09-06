#!/usr/bin/env python3
import http.server
import socketserver
import socket
import os

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add security headers and cache control
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Frame-Options', 'ALLOWALL')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        # Camera access permissions
        self.send_header('Permissions-Policy', 'camera=*, microphone=*')
        self.send_header('Feature-Policy', 'camera *; microphone *')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/scan.html'
        return super().do_GET()

PORT = 5000
Handler = CustomHTTPRequestHandler

print(f"Starting server at http://0.0.0.0:{PORT}")
print("Serving Mythic Eyes: Emotion Awakening AR Scanner")

try:
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        # Allow socket reuse to prevent "Address already in use" errors
        httpd.allow_reuse_address = True
        httpd.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        httpd.serve_forever()
except OSError as e:
    if e.errno == 98:  # Address already in use
        print(f"Port {PORT} is already in use. Attempting to terminate existing processes...")
        import subprocess
        try:
            # Kill any existing process on port 5000
            subprocess.run(['pkill', '-f', 'server.py'], check=False)
            subprocess.run(['fuser', '-k', f'{PORT}/tcp'], check=False)
            print("Existing processes terminated. Retrying...")
            # Retry after cleanup
            with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
                httpd.allow_reuse_address = True
                httpd.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                httpd.serve_forever()
        except Exception as retry_error:
            print(f"Failed to restart server: {retry_error}")
            raise
    else:
        raise