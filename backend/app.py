import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from transformers import pipeline
import tempfile

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Whisper model
transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-base")

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


@app.post('/api/transcribe')
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name

    try:
        # Transcribe audio
        result = transcriber(temp_path)
        transcription = result['text']

        return jsonify({
            'success': True,
            'transcription': transcription
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.unlink(temp_path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
