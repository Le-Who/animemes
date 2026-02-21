
import threading
import http.server
import socketserver
import os
import time
from playwright.sync_api import sync_playwright

PORT = 8001
SERVER_URL = f"http://localhost:{PORT}"

def run_server():
    # Serve current directory
    os.chdir(os.getcwd())
    Handler = http.server.SimpleHTTPRequestHandler
    # Allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(SERVER_URL)

        # Wait for data to load
        page.wait_for_selector("#name1")

        # Take screenshot of initial state
        page.screenshot(path="verification_initial.png")
        print("Initial screenshot taken.")

        # Click to vote
        page.click("#c1")

        # Wait for animation
        page.wait_for_timeout(1000)

        # Take screenshot of result
        page.screenshot(path="verification_result.png")
        print("Result screenshot taken.")

        browser.close()

if __name__ == "__main__":
    # Start server in thread
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    # Give server a moment to start
    time.sleep(1)

    verify()
