import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK_URL')


@app.get('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200


@app.post('/api/slack-message')
def send_message():
    text = request.json.get('text')
    if not text:
        return jsonify({'success': False, 'error': 'Text required'}), 400

    requests.post(SLACK_WEBHOOK, json={'text': text})
    return jsonify({'success': True, 'message': 'Message sent to Slack'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
