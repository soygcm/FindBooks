import http.server, socketserver, urllib.parse, os

class Handler( http.server.SimpleHTTPRequestHandler ):
    def do_GET( self ):
        urlParams = urllib.parse.urlparse(self.path)
        if os.access( '.' + os.sep + urlParams.path, os.R_OK ):
            http.server.SimpleHTTPRequestHandler.do_GET(self);
        else:
            self.send_response(200)
            self.send_header( 'Content-type', 'text/html' )
            self.end_headers()
            self.wfile.write( open('index.html').read() )

httpd = socketserver.TCPServer( ('127.0.0.1', 8000), Handler )
httpd.serve_forever()