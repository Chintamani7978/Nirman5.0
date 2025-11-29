import mne
import numpy as np
import pandas as pd
import io
from fastapi import HTTPException

REQUIRED_CHANNELS = [
    'Fp1', 'Fp2', 'F7', 'F3', 'Fz', 'F4', 'F8', 'T3',
    'C3', 'Cz', 'C4', 'T4', 'T5', 'P3', 'Pz', 'P4'
]

TARGET_SFREQ = 256

def parse_edf(file_content: bytes) -> np.ndarray:
    """
    Parses an EDF file content and returns a 2D numpy array [samples, channels].
    """
    try:
        # MNE reads from a file path, so we need to write to a temp file or use a BytesIO wrapper if supported.
        # MNE's read_raw_edf strictly requires a filename.
        # We will write to a temp file.
        import tempfile
        import os

        with tempfile.NamedTemporaryFile(suffix=".edf", delete=False) as tmp:
            tmp.write(file_content)
            tmp_path = tmp.name

        try:
            raw = mne.io.read_raw_edf(tmp_path, preload=True, verbose=False)
        finally:
            os.remove(tmp_path)

        # Pick channels
        # MNE channel names might be case sensitive or have extra labels (e.g. "EEG Fp1-REF")
        # We need a robust matching strategy.
        available_channels = raw.ch_names
        picked_channels = []

        for req_ch in REQUIRED_CHANNELS:
            # Try exact match
            if req_ch in available_channels:
                picked_channels.append(req_ch)
                continue

            # Try case-insensitive or substring match
            # This is a heuristic; might need refinement based on actual data
            match = None
            for av_ch in available_channels:
                if req_ch.lower() in av_ch.lower():
                    match = av_ch
                    break

            if match:
                picked_channels.append(match)
            else:
                raise HTTPException(status_code=400, detail=f"Missing required channel: {req_ch}")

        raw.pick_channels(picked_channels)

        # Reorder channels to match training order
        raw.reorder_channels(picked_channels) # pick_channels might preserve order, but let's be safe if we mapped them

        # Resample if necessary
        if raw.info['sfreq'] != TARGET_SFREQ:
            raw.resample(TARGET_SFREQ)

        # Get data
        data, times = raw.get_data(return_times=True)
        # data is [channels, samples], we need [samples, channels]
        return data.T

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing EDF file: {str(e)}")

def parse_csv(file_content: str) -> np.ndarray:
    """
    Parses a CSV string and returns a 2D numpy array.
    Assumes columns are channels and rows are timepoints.
    """
    try:
        df = pd.read_csv(io.StringIO(file_content))

        # Basic validation: check if we have 16 columns
        # In a real app, we'd check headers too
        if df.shape[1] != 16:
             # Try to select by name if headers exist
            if all(ch in df.columns for ch in REQUIRED_CHANNELS):
                df = df[REQUIRED_CHANNELS]
            else:
                raise HTTPException(status_code=400, detail=f"CSV must have 16 channels. Found {df.shape[1]}")

        return df.values
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV file: {str(e)}")
