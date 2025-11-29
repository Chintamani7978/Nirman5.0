import io
import numpy as np
import librosa
import soundfile as sf
from pydub import AudioSegment

def convert_audio_format(input_bytes: bytes, output_format='wav') -> bytes:
    """
    Convert audio bytes to specified format (default wav).
    """
    try:
        audio = AudioSegment.from_file(io.BytesIO(input_bytes))
        buffer = io.BytesIO()
        audio.export(buffer, format=output_format)
        return buffer.getvalue()
    except Exception as e:
        raise ValueError(f"Error converting audio format: {e}")

def resample_audio(audio: np.ndarray, orig_sr: int, target_sr=16000) -> np.ndarray:
    """
    Resample audio to target sample rate.
    """
    if orig_sr == target_sr:
        return audio
    return librosa.resample(y=audio, orig_sr=orig_sr, target_sr=target_sr)

def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """
    Normalize audio to -1 to 1 range.
    """
    max_val = np.max(np.abs(audio))
    if max_val == 0:
        return audio
    return audio / max_val

def split_audio_channels(audio: np.ndarray) -> np.ndarray:
    """
    If stereo, return mono (average).
    """
    if len(audio.shape) > 1:
        return np.mean(audio, axis=1)
    return audio

def load_audio_from_bytes(audio_bytes: bytes, target_sr=16000):
    """
    Load audio from bytes into numpy array.
    """
    # Use soundfile or librosa
    # soundfile requires a file-like object
    try:
        data, samplerate = sf.read(io.BytesIO(audio_bytes))

        # Convert to mono if needed
        if len(data.shape) > 1:
            data = np.mean(data, axis=1)

        # Resample if needed
        if samplerate != target_sr:
            data = librosa.resample(y=data, orig_sr=samplerate, target_sr=target_sr)

        return data, target_sr
    except Exception as e:
        # Fallback to pydub if soundfile fails (e.g. for some formats)
        try:
            audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
            audio = audio.set_frame_rate(target_sr).set_channels(1)
            return np.array(audio.get_array_of_samples()).astype(np.float32) / 32768.0, target_sr
        except Exception as e2:
            raise ValueError(f"Failed to load audio: {e} | {e2}")
