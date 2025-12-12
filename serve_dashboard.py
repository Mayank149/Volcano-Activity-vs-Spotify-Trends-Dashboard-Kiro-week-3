#!/usr/bin/env python3
"""
Simple HTTP server to serve the dashboard locally
Run this script and open http://localhost:8000 in your browser
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8002

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)

def main():
    # Check if dashboard directory exists
    if not os.path.exists("dashboard"):
        print("Error: dashboard directory not found!")
        print("Please run data_processor.py first to generate the dashboard files.")
        sys.exit(1)
    
    # Check if required files exist
    required_files = ["index.html", "styles.css", "dashboard.js"]
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print("Error: Missing required dashboard files:")
        for f in missing_files:
            print(f"  - {f}")
        sys.exit(1)
    
    print(f"🌋🎵 Volcano vs Spotify Dashboard Server")
    print(f"Starting server on port {PORT}...")
    print(f"Dashboard will be available at: http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"Server started successfully!")
            
            # Try to open browser automatically
            try:
                webbrowser.open(f"http://localhost:{PORT}")
                print("Opening dashboard in your default browser...")
            except:
                print("Could not open browser automatically. Please navigate to the URL above.")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except OSError as e:
        if e.errno == 10048:  # Port already in use on Windows
            print(f"Error: Port {PORT} is already in use!")
            print("Please close any other applications using this port or change the PORT variable.")
        else:
            print(f"Error starting server: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()