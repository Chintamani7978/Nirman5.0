import numpy as np
import pandas as pd
from scipy.signal import welch
from typing import List, Dict, Union

# Frequency bands
BANDS = {
    "delta": [0.5, 4],
    "theta": [4, 8],
    "alpha": [8, 13],
    "beta": [13, 30],
    "gamma": [30, 45]
}

def compute_bandpower(data: np.ndarray, fs: int, method: str = 'welch') -> Dict[str, float]:
    """
    Compute absolute bandpower for a single channel.

    Args:
        data: 1D array of EEG data for one channel.
        fs: Sampling rate.
        method: 'welch' is the default.

    Returns:
        Dictionary of bandpowers.
    """
    # Compute PSD
    freqs, psd = welch(data, fs, nperseg=fs*2) # 2 second window for Welch

    # Frequency resolution
    freq_res = freqs[1] - freqs[0]

    bandpowers = {}
    total_power = 0

    for band, (low, high) in BANDS.items():
        # Find indices corresponding to the band
        idx_band = np.logical_and(freqs >= low, freqs <= high)
        # Integral approximation (sum * resolution)
        power = np.sum(psd[idx_band]) * freq_res
        bandpowers[f"{band}_abs"] = power
        total_power += power

    # Add relative powers
    for band in BANDS.keys():
        bandpowers[f"{band}_rel"] = bandpowers[f"{band}_abs"] / total_power if total_power > 0 else 0

    return bandpowers

def extract_features_from_segment(segment: np.ndarray, fs: int = 256, channel_names: List[str] = None) -> np.ndarray:
    """
    Extract features from a multi-channel EEG segment.

    Args:
        segment: 2D array [n_samples, n_channels]
        fs: Sampling rate
        channel_names: List of channel names (optional, for structured return if needed)

    Returns:
        1D feature vector.
    """
    n_samples, n_channels = segment.shape

    features = []

    # Per-channel features
    for ch in range(n_channels):
        ch_data = segment[:, ch]

        # Time domain stats
        features.append(np.mean(ch_data))
        features.append(np.std(ch_data))
        features.append(pd.Series(ch_data).skew())
        features.append(pd.Series(ch_data).kurtosis())

        # Frequency domain features
        bp = compute_bandpower(ch_data, fs)
        # Order: delta_abs, theta_abs, ..., delta_rel, ...
        # We sort by keys to be deterministic
        for key in sorted(bp.keys()):
            features.append(bp[key])

    # Global features (ratios, etc.) - Simplified for now
    # TODO: Add cross-channel features if needed

    return np.array(features)

def segment_data(df: pd.DataFrame, window_size_sec: int = 4, step_size_sec: int = 2, fs: int = 256):
    """
    Generator that yields segments of data.
    """
    window_size_samples = window_size_sec * fs
    step_size_samples = step_size_sec * fs

    n_rows = len(df)

    for start in range(0, n_rows - window_size_samples + 1, step_size_samples):
        end = start + window_size_samples
        segment = df.iloc[start:end]
        yield segment
