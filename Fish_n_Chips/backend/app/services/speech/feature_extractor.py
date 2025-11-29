import librosa
import numpy as np
import spacy
from typing import Dict, Any

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_acoustic_features(audio_path: str) -> Dict[str, Any]:
    """
    Extract acoustic features using librosa.
    """
    try:
        y, sr = librosa.load(audio_path, sr=None)

        # Pitch (F0)
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        f0_clean = f0[~np.isnan(f0)]

        pitch_mean = float(np.mean(f0_clean)) if len(f0_clean) > 0 else 0.0
        pitch_std = float(np.std(f0_clean)) if len(f0_clean) > 0 else 0.0

        # Energy (RMS)
        rms = librosa.feature.rms(y=y)
        energy_mean = float(np.mean(rms))

        # MFCCs
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_means = np.mean(mfccs, axis=1).tolist()

        # Speech Rate (approximate based on duration and non-silent segments)
        duration = librosa.get_duration(y=y, sr=sr)

        return {
            "pitch_mean": pitch_mean,
            "pitch_std": pitch_std,
            "energy_mean": energy_mean,
            "mfcc_features": mfcc_means,
            "duration": duration
        }
    except Exception as e:
        print(f"Error extracting acoustic features: {e}")
        return {}

def extract_linguistic_features(text: str) -> Dict[str, Any]:
    """
    Extract linguistic features using spaCy.
    """
    if not text:
        return {}

    doc = nlp(text)

    word_count = len([token for token in doc if not token.is_punct])
    unique_words = len(set([token.text.lower() for token in doc if not token.is_punct]))

    total_chars = sum(len(token.text) for token in doc if not token.is_punct)
    avg_word_length = total_chars / word_count if word_count > 0 else 0

    lexical_diversity = unique_words / word_count if word_count > 0 else 0

    pos_counts = doc.count_by(spacy.attrs.POS)
    pos_distribution = {doc.vocab[pos].text: count for pos, count in pos_counts.items()}

    return {
        "word_count": word_count,
        "unique_words": unique_words,
        "avg_word_length": avg_word_length,
        "lexical_diversity": lexical_diversity,
        "pos_distribution": pos_distribution
    }
