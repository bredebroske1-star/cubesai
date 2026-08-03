from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import html

import archai

app = Flask(__name__, static_folder='web', static_url_path='')

# Security: limit upload size to avoid abuse (8 KB)
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024

# Rate limiting
limiter = Limiter(key_func=get_remote_address, default_limits=[])
limiter.init_app(app)

# CORS: restrict origin via ALLOWED_ORIGINS env var (comma-separated)
allowed = os.environ.get('ALLOWED_ORIGINS')
if allowed:
    origins = [o.strip() for o in allowed.split(',') if o.strip()]
else:
    origins = ['http://localhost:8000', 'https://archaiweb2026.loca.lt']
CORS(app, resources={r"/api/*": {"origins": origins}})


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def static_proxy(path):
    # Serve files from the web/ directory if they exist, otherwise serve index
    web_path = os.path.join('web', path)
    if os.path.exists(web_path) and not os.path.isdir(web_path):
        return send_from_directory('web', path)
    return app.send_static_file('index.html')


@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.get_json(silent=True) or {}
    message = data.get('message', '')

    # Basic input sanitization and length limit
    if not isinstance(message, str):
        return jsonify({'error': 'Invalid input'}), 400
    message = message.strip()
    if len(message) == 0:
        return jsonify({'reply': archai.get_response(message)})
    if len(message) > 1500:
        return jsonify({'error': 'Message too long (max 1500 chars)'}), 413

    # Escape any HTML just in case (responses are plain text)
    safe_message = html.escape(message)

    reply = archai.get_response(safe_message)
    # archai.get_response returns None for exit/quit — convert to a message
    if reply is None:
        reply = 'Goodbye.'
    return jsonify({'reply': reply})



@app.after_request
def set_security_headers(response):
    # Common security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'no-referrer'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=()'
    # Content-Security-Policy: restrict to self; allow styles and scripts from same origin
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
    # HSTS (only has effect over HTTPS)
    response.headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload'
    return response


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
