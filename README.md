# Transcription Sandbox

## Application Workflow

1. **Upload & Transcribe**: MP3 file → transcription appears in both the green success box and automatically loads into the textarea below
2. **Review/Edit**: You can review or edit the text in the textarea
3. **Send**: Click "Send to Slack" button → text gets posted to your Slack channel

## Technical Notes

### What Whisper Provides

- **Feature Extractor** - Converts audio → mel-spectrogram
- **Transformer Model** - Neural network that analyzes patterns and generates text

### What torchaudio Provides

- **Audio loading/decoding** - Loads audio files (calls FFmpeg for MP3s)
- **Resampling** - Changes sample rate (e.g., 44.1kHz → 16kHz)
- **Audio transformations** - Provides various audio processing operations

### MP3 → Text Pipeline

```
MP3 File (compressed binary)
   ↓
[torchaudio calls FFmpeg] Decode MP3 to raw audio samples
   ↓
Raw Audio Array
   ↓
[torchaudio] Resample to 16kHz (if needed)
   ↓
Numerical Array [0.023, -0.045, 0.012, ...]
(16,000 samples per second)
   ↓
[Whisper Feature Extractor] Convert to Mel-Spectrogram
   ↓
Mel-Spectrogram (2D frequency-time representation)
   ↓
[Whisper Transformer] Analyze audio patterns
   ↓
Token IDs [1820, 318, 257, ...]
   ↓
[Whisper Decoder] Convert tokens to text
   ↓
Text Output "This is the transcribed text"
```
