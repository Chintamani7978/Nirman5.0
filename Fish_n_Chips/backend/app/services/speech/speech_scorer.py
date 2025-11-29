"""
ML-based speech scoring with IMPROVED pause analysis.
Now properly considers pause duration, variability, and hesitations.
"""
import joblib
import numpy as np
from typing import Dict, Any, List
import os

# Load the trained model
MODEL_PATH = "models/speech_ml_model.joblib"

try:
    ml_model = joblib.load(MODEL_PATH)
    print(f"✅ Loaded IMPROVED ML model from {MODEL_PATH}")
    print(f"   Model now emphasizes PAUSE PATTERNS!")
except FileNotFoundError:
    print(f"⚠️ ML model not found at {MODEL_PATH}. Please train the model first.")
    ml_model = None

def calculate_pause_features(pause_analysis: Dict[str, Any]) -> Dict[str, float]:
    """
    Calculate advanced pause features from pause analysis.

    Args:
        pause_analysis: Output from analyze_pauses() containing:
            - avg_pause_duration
            - max_pause
            - long_pause_count
            - pause_locations (list of pauses)

    Returns:
        Dictionary with pause features
    """
    pause_locations = pause_analysis.get("pause_locations", [])

    # Calculate pause variability (standard deviation of pause durations)
    if len(pause_locations) >= 2:
        pause_durations = [p["duration"] for p in pause_locations]
        pause_variability = np.std(pause_durations)
    else:
        pause_variability = 0.0

    # Count hesitations (pauses > 1.0s are considered hesitations)
    hesitation_count = len([p for p in pause_locations if p["duration"] > 1.0])

    return {
        'avg_pause_duration': pause_analysis.get("avg_pause_duration", 0.0),
        'max_pause_duration': pause_analysis.get("max_pause", 0.0),
        'pause_variability': pause_variability,
        'long_pause_count': pause_analysis.get("long_pause_count", 0),
        'hesitation_count': hesitation_count
    }

def calculate_ml_risk_score(
    reaction_time_ms: float,
    speech_rate_wpm: float,
    pause_analysis: Dict[str, Any],  # Changed to accept full pause_analysis
    word_accuracy: float
) -> Dict[str, Any]:
    """
    Calculate risk score using IMPROVED ML model with pause emphasis.

    Args:
        reaction_time_ms: Time to start speaking after stimulus (ms)
        speech_rate_wpm: Words per minute
        pause_analysis: Full pause analysis dict from analyze_pauses()
        word_accuracy: Word accuracy percentage (0-100)

    Returns:
        Dictionary with risk score, level, probability, and detailed analysis
    """

    if ml_model is None:
        return fallback_scoring(reaction_time_ms, speech_rate_wpm,
                               pause_analysis.get("avg_pause_duration", 0), word_accuracy)

    # Extract advanced pause features
    pause_features = calculate_pause_features(pause_analysis)

    # Prepare features in the EXACT order as training
    features = np.array([[
        reaction_time_ms,
        speech_rate_wpm,
        pause_features['avg_pause_duration'],
        pause_features['max_pause_duration'],
        pause_features['pause_variability'],
        word_accuracy,
        pause_features['long_pause_count'],
        pause_features['hesitation_count']
    ]])

    # Get prediction and probability
    prediction = ml_model.predict(features)[0]
    probability = ml_model.predict_proba(features)[0]

    # Risk probability (probability of cognitive decline)
    risk_probability = probability[1]

    # Convert to 0-100 scale
    risk_score = risk_probability * 100

    # Determine risk level
    if risk_score < 25:
        risk_level = "Low"
    elif risk_score < 60:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Get feature importances
    feature_names = [
        'reaction_time_ms', 'speech_rate_wpm', 'avg_pause_duration',
        'max_pause_duration', 'pause_variability', 'word_accuracy',
        'long_pause_count', 'hesitation_count'
    ]

    feature_importances = ml_model.feature_importances_

    # Calculate normalized component scores for display
    component_scores = {
        'reaction_time_score': min(reaction_time_ms / 30, 100),
        'speech_rate_score': max(0, 100 - speech_rate_wpm / 1.5),
        'pause_score': min(pause_features['avg_pause_duration'] * 60, 100),  # Pauses are CRITICAL now
        'accuracy_score': max(0, 100 - word_accuracy),
        'hesitation_score': min(pause_features['hesitation_count'] * 15, 100)
    }

    return {
        "overall_risk": round(risk_score, 1),
        "risk_level": risk_level,
        "risk_probability": round(risk_probability, 3),
        "prediction": "Cognitive Decline" if prediction == 1 else "Healthy",
        "confidence": round(max(probability) * 100, 1),
        "component_scores": component_scores,
        "pause_analysis": {
            "avg_pause_duration": round(pause_features['avg_pause_duration'], 2),
            "max_pause_duration": round(pause_features['max_pause_duration'], 2),
            "pause_variability": round(pause_features['pause_variability'], 2),
            "long_pause_count": pause_features['long_pause_count'],
            "hesitation_count": pause_features['hesitation_count'],
            "pause_locations": pause_analysis.get("pause_locations", [])
        },
        "feature_importances": {
            name: round(imp, 3)
            for name, imp in zip(feature_names, feature_importances)
        },
        "model_type": "RandomForest_PauseFocused",
        "features_used": {
            "reaction_time_ms": reaction_time_ms,
            "speech_rate_wpm": speech_rate_wpm,
            "avg_pause_duration": pause_features['avg_pause_duration'],
            "max_pause_duration": pause_features['max_pause_duration'],
            "pause_variability": pause_features['pause_variability'],
            "word_accuracy": word_accuracy,
            "long_pause_count": pause_features['long_pause_count'],
            "hesitation_count": pause_features['hesitation_count']
        }
    }

def fallback_scoring(reaction_time_ms, speech_rate_wpm, avg_pause_duration, word_accuracy):
    """Simple fallback if ML model not available"""
    rt_score = min(reaction_time_ms / 30, 100)
    sr_score = max(0, 100 - speech_rate_wpm / 1.5)
    pause_score = min(avg_pause_duration * 100, 100)
    acc_score = max(0, 100 - word_accuracy)

    # Pause is now MORE important in fallback too
    overall = (rt_score * 0.25 + sr_score * 0.10 + pause_score * 0.45 + acc_score * 0.20)

    return {
        "overall_risk": round(overall, 1),
        "risk_level": "High" if overall > 60 else "Medium" if overall > 30 else "Low",
        "component_scores": {
            "reaction_time_score": rt_score,
            "speech_rate_score": sr_score,
            "pause_score": pause_score,
            "accuracy_score": acc_score
        },
        "model_type": "Fallback_PauseFocused"
    }
