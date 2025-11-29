import os
from openai import OpenAI
import io

# Initialize OpenAI client
# Ensure OPENAI_API_KEY is set in environment
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    client = OpenAI(api_key=api_key)
else:
    print("Warning: OPENAI_API_KEY not found. Whisper service will use dummy data.")
    client = None

def transcribe_with_timestamps(audio_file_path: str):
    """
    Transcribe audio file using OpenAI Whisper API and return text with word timestamps.
    """
    if not client:
        return {
            "text": "Dummy transcription (API Key missing)",
            "words": [
                {"word": "Dummy", "start": 0.0, "end": 0.5},
                {"word": "transcription", "start": 0.6, "end": 1.5}
            ]
        }

    try:
        with open(audio_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )

        return {
            "text": transcript.text,
            "words": transcript.words
        }
    except Exception as e:
        print(f"Whisper API error: {e}")
        # Return dummy data for testing if API fails or key is missing
        return {
            "text": "Error in transcription",
            "words": []
        }
