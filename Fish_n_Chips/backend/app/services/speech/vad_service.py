import webrtcvad
import numpy as np

def detect_speech_start(audio_bytes: bytes, sample_rate: int = 16000) -> float:
    """
    Detect the start time of speech in milliseconds using WebRTC VAD.
    Assumes audio is 16-bit mono PCM.
    """
    vad = webrtcvad.Vad(3) # Aggressiveness mode 3 (high)

    # Frame duration in ms (10, 20, or 30ms supported by webrtcvad)
    frame_duration_ms = 30
    frame_size = int(sample_rate * frame_duration_ms / 1000) * 2 # 2 bytes per sample

    offset = 0
    while offset + frame_size < len(audio_bytes):
        frame = audio_bytes[offset:offset + frame_size]
        if vad.is_speech(frame, sample_rate):
            return (offset / 2 / sample_rate) * 1000 # Convert bytes offset to ms
        offset += frame_size

    return -1.0 # No speech detected
