#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8080
DIRECTORY = "."

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def open_browser():
    # Wait for the server to spin up
    time.sleep(1)
    url = f"http://localhost:{PORT}/index.html"
    print(f"\n[INFO] Opening application in your web browser: {url}")
    webbrowser.open(url)

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n[SUCCESS] Local server started on port {PORT}")
        print(f"[INFO] Press Ctrl+C to stop the server.")
        httpd.serve_forever()

if __name__ == "__main__":
    # Start browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()
    try:
        run_server()
    except KeyboardInterrupt:
        print("\n[INFO] Server stopped. Goodbye!")
