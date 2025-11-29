"""
Improved pause detection using audio analysis instead of relying on Whisper timestamps.
Uses librosa to detect actual silence/pauses in the audio waveform.
"""
import numpy as np
import librosa
from typing import Dict, Any, List

def detect_pauses_from_audio(audio_path: str, min_silence_duration: float = 0.3) -> Dict[str, Any]:
    """
    Detect pauses by analyzing the audio waveform directly.

    Args:
        audio_path: Path to audio file
        min_silence_duration: Minimum duration (seconds) to consider as a pause

    Returns:
        Dictionary with pause statistics
    """
    print(f"\n{'='*70}")
    print(f"🎵 AUDIO-BASED PAUSE DETECTION STARTING...")
    print(f"   Audio file: {audio_path}")
    print(f"   Min silence duration: {min_silence_duration}s")
    print(f"{'='*70}")

    try:
        # Load audio
        print("   Loading audio...")
        y, sr = librosa.load(audio_path, sr=None)
        print(f"   ✅ Audio loaded: {len(y)} samples at {sr}Hz ({len(y)/sr:.2f}s)")

        # Calculate RMS energy (volume) over time
        frame_length = int(sr * 0.025)  # 25ms frames
        hop_length = int(sr * 0.010)    # 10ms hop

        print("   Calculating energy...")
        rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]

        # Convert to dB
        rms_db = librosa.amplitude_to_db(rms, ref=np.max)

        # ADAPTIVE threshold based on audio content
        # Find the noise floor (10th percentile of energy)
        noise_floor = np.percentile(rms_db, 10)
        # Set threshold 10dB above noise floor
        silence_threshold = noise_floor + 10

        print(f"   Noise floor: {noise_floor:.1f}dB")
        print(f"   Adaptive silence threshold: {silence_threshold:.1f}dB")
        print(f"   Max energy: {np.max(rms_db):.1f}dB")

        # Find silent frames
        is_silent = rms_db < silence_threshold
        silent_frame_count = np.sum(is_silent)
        print(f"   Silent frames: {silent_frame_count}/{len(is_silent)} ({silent_frame_count/len(is_silent)*100:.1f}%)")

        # Convert frame indices to time
        times = librosa.frames_to_time(np.arange(len(is_silent)), sr=sr, hop_length=hop_length)

        # Find continuous silent regions
        pauses = []
        pause_start = None

        for i, (silent, time) in enumerate(zip(is_silent, times)):
            if silent and pause_start is None:
                # Start of pause
                pause_start = time
            elif not silent and pause_start is not None:
                # End of pause
                pause_duration = time - pause_start
                if pause_duration >= min_silence_duration:
                    pauses.append({
                        'start': pause_start,
                        'end': time,
                        'duration': pause_duration
                    })
                pause_start = None

        # Handle pause at end of audio
        if pause_start is not None:
            pause_duration = times[-1] - pause_start
            if pause_duration >= min_silence_duration:
                pauses.append({
                    'start': pause_start,
                    'end': times[-1],
                    'duration': pause_duration
                })

        if not pauses:
            return {
                "avg_pause_duration": 0.0,
                "max_pause": 0.0,
                "long_pause_count": 0,
                "pause_count": 0,
                "pause_locations": [],
                "total_pause_time": 0.0
            }

        pause_durations = [p['duration'] for p in pauses]
        avg_pause = np.mean(pause_durations)
        max_pause = np.max(pause_durations)
        long_pause_count = len([p for p in pause_durations if p > 0.8])
        total_pause_time = sum(pause_durations)

        # Calculate pause variability
        pause_variability = np.std(pause_durations) if len(pause_durations) > 1 else 0.0

        print(f"\n🎵 AUDIO-BASED PAUSE DETECTION:")
        print(f"   Total pauses detected: {len(pauses)}")
        print(f"   Avg pause: {avg_pause:.2f}s")
        print(f"   Max pause: {max_pause:.2f}s")
        print(f"   Long pauses (>0.8s): {long_pause_count}")
        print(f"   Pause variability: {pause_variability:.2f}s")
        print(f"   Total pause time: {total_pause_time:.2f}s")

        # Print each pause
        for i, pause in enumerate(pauses[:5]):  # Show first 5
            print(f"   Pause {i+1}: {pause['start']:.2f}s - {pause['end']:.2f}s ({pause['duration']:.2f}s)")

        return {
            "avg_pause_duration": float(avg_pause),
            "max_pause": float(max_pause),
            "long_pause_count": int(long_pause_count),
            "pause_count": len(pauses),
            "pause_variability": float(pause_variability),
            "pause_locations": pauses,
            "total_pause_time": float(total_pause_time)
        }

    except Exception as e:
        print(f"❌ Error in audio-based pause detection: {e}")
        return {
            "avg_pause_duration": 0.0,
            "max_pause": 0.0,
            "long_pause_count": 0,
            "pause_count": 0,
            "pause_variability": 0.0,
            "pause_locations": [],
            "total_pause_time": 0.0
        }


def analyze_pauses(word_timestamps: List[Any]) -> Dict[str, Any]:
    """
    DEPRECATED: Whisper timestamps are not reliable for pause detection.
    Use detect_pauses_from_audio() instead.

    This function is kept for backward compatibility but will return
    minimal data.
    """
    print(f"\n⚠️ Using Whisper timestamps for pause detection (not recommended)")
    print(f"   Number of words: {len(word_timestamps)}")

    if not word_timestamps or len(word_timestamps) < 2:
        return {
            "avg_pause_duration": 0.0,
            "max_pause": 0.0,
            "long_pause_count": 0,
            "pause_locations": []
        }

    pauses = []
    pause_locations = []

    for i in range(len(word_timestamps) - 1):
        current_word = word_timestamps[i]
        next_word = word_timestamps[i+1]

        try:
            end_time = current_word.end
            start_time = next_word.start
            word_text = current_word.word
        except AttributeError:
            end_time = current_word.get('end', 0)
            start_time = next_word.get('start', 0)
            word_text = current_word.get('word', '')

        gap = start_time - end_time

        if gap > 0:
            pauses.append(gap)
            if gap > 0.5:
                pause_locations.append({
                    "after_word": word_text,
                    "duration": gap
                })

    if not pauses:
        return {
            "avg_pause_duration": 0.0,
            "max_pause": 0.0,
            "long_pause_count": 0,
            "pause_locations": []
        }

    avg_pause = sum(pauses) / len(pauses)
    max_pause = max(pauses)
    long_pause_count = len([p for p in pauses if p > 0.8])

    return {
        "avg_pause_duration": avg_pause,
        "max_pause": max_pause,
        "long_pause_count": long_pause_count,
        "pause_locations": pause_locations
    }
