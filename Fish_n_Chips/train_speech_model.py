"""
Generate improved synthetic speech analysis dataset with STRONGER pause patterns.
This version emphasizes pause duration as a critical feature for dementia detection.
"""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib

# Set random seed for reproducibility
np.random.seed(42)

def generate_improved_dataset(n_samples=1000):
    """
    Generate synthetic speech data with EMPHASIS on pause patterns.

    Key changes:
    - Pause duration is now the MOST discriminative feature
    - Added inter-word pause variability
    - Added hesitation patterns
    - More realistic distributions
    """

    n_healthy = n_samples // 2
    n_decline = n_samples - n_healthy

    # HEALTHY GROUP (label = 0)
    # Normal adults: quick, consistent pauses
    healthy_data = {
        'reaction_time_ms': np.random.normal(1200, 250, n_healthy),
        'speech_rate_wpm': np.random.normal(145, 18, n_healthy),
        'avg_pause_duration': np.random.normal(0.25, 0.08, n_healthy),  # SHORT pauses
        'max_pause_duration': np.random.normal(0.5, 0.15, n_healthy),   # Max pause also short
        'pause_variability': np.random.normal(0.15, 0.05, n_healthy),   # Consistent pauses
        'word_accuracy': np.random.normal(92, 6, n_healthy),
        'long_pause_count': np.random.poisson(0.8, n_healthy),          # Few long pauses
        'hesitation_count': np.random.poisson(1.0, n_healthy),          # Few hesitations
        'label': np.zeros(n_healthy, dtype=int)
    }

    # COGNITIVE DECLINE GROUP (label = 1)
    # Dementia patients: LONG, VARIABLE pauses (CRITICAL DIFFERENCE)
    decline_data = {
        'reaction_time_ms': np.random.normal(2400, 500, n_decline),
        'speech_rate_wpm': np.random.normal(95, 22, n_decline),
        'avg_pause_duration': np.random.normal(1.2, 0.4, n_decline),    # MUCH LONGER pauses
        'max_pause_duration': np.random.normal(2.5, 0.8, n_decline),    # Very long max pauses
        'pause_variability': np.random.normal(0.6, 0.2, n_decline),     # INCONSISTENT pauses
        'word_accuracy': np.random.normal(68, 12, n_decline),
        'long_pause_count': np.random.poisson(5.5, n_decline),          # MANY long pauses
        'hesitation_count': np.random.poisson(4.5, n_decline),          # Frequent hesitations
        'label': np.ones(n_decline, dtype=int)
    }

    # Combine datasets
    healthy_df = pd.DataFrame(healthy_data)
    decline_df = pd.DataFrame(decline_data)

    df = pd.concat([healthy_df, decline_df], ignore_index=True)

    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # Clip values to realistic ranges
    df['reaction_time_ms'] = df['reaction_time_ms'].clip(500, 5000)
    df['speech_rate_wpm'] = df['speech_rate_wpm'].clip(50, 200)
    df['avg_pause_duration'] = df['avg_pause_duration'].clip(0.1, 3.0)
    df['max_pause_duration'] = df['max_pause_duration'].clip(0.2, 5.0)
    df['pause_variability'] = df['pause_variability'].clip(0.05, 1.5)
    df['word_accuracy'] = df['word_accuracy'].clip(30, 100)
    df['long_pause_count'] = df['long_pause_count'].clip(0, 20)
    df['hesitation_count'] = df['hesitation_count'].clip(0, 15)

    return df

def train_improved_model(df):
    """Train RandomForest with emphasis on pause features"""

    # Features - NOTE: More pause-related features now!
    feature_cols = [
        'reaction_time_ms',
        'speech_rate_wpm',
        'avg_pause_duration',      # CRITICAL
        'max_pause_duration',       # NEW - CRITICAL
        'pause_variability',        # NEW - CRITICAL
        'word_accuracy',
        'long_pause_count',         # CRITICAL
        'hesitation_count'          # NEW
    ]

    X = df[feature_cols]
    y = df['label']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train Random Forest with adjusted parameters
    print("Training IMPROVED Random Forest Classifier...")
    print("Focus: PAUSE PATTERNS as primary indicator\n")

    model = RandomForestClassifier(
        n_estimators=150,           # More trees
        max_depth=12,               # Slightly deeper
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        class_weight='balanced'
    )

    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print("\n" + "="*70)
    print("IMPROVED MODEL EVALUATION (Pause-Focused)")
    print("="*70)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred,
                                target_names=['Healthy', 'Cognitive Decline']))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    print(f"\nROC-AUC Score: {roc_auc_score(y_test, y_proba):.3f}")

    print("\n" + "="*70)
    print("FEATURE IMPORTANCES (Higher = More Important)")
    print("="*70)
    importances = sorted(zip(feature_cols, model.feature_importances_),
                        key=lambda x: x[1], reverse=True)
    for feat, imp in importances:
        bar = "█" * int(imp * 50)
        print(f"  {feat:25s}: {imp:.3f} {bar}")

    return model, X_test, y_test

def save_improved_model(model, df):
    """Save the improved model"""
    model_path = 'models/speech_ml_model.joblib'
    joblib.dump(model, model_path)
    print(f"\n✅ IMPROVED Model saved to {model_path}")

    data_path = 'data/synthetic_speech_dataset.csv'
    df.to_csv(data_path, index=False)
    print(f"✅ Dataset saved to {data_path}")

    return model_path, data_path

if __name__ == "__main__":
    print("="*70)
    print("GENERATING IMPROVED DATASET - PAUSE-FOCUSED")
    print("="*70)
    print("\nKey Improvements:")
    print("  1. Pause duration is now PRIMARY discriminator")
    print("  2. Added max_pause_duration (catches long hesitations)")
    print("  3. Added pause_variability (inconsistent pauses)")
    print("  4. Added hesitation_count")
    print("\n")

    # Generate dataset
    df = generate_improved_dataset(n_samples=1000)
    print(f"✅ Generated {len(df)} samples")
    print(f"   - Healthy: {(df['label']==0).sum()}")
    print(f"   - Cognitive Decline: {(df['label']==1).sum()}")

    print("\nPause Duration Statistics:")
    print(f"  Healthy avg pause:     {df[df['label']==0]['avg_pause_duration'].mean():.2f}s")
    print(f"  Decline avg pause:     {df[df['label']==1]['avg_pause_duration'].mean():.2f}s")
    print(f"  Difference:            {df[df['label']==1]['avg_pause_duration'].mean() / df[df['label']==0]['avg_pause_duration'].mean():.1f}x longer")

    # Train model
    model, X_test, y_test = train_improved_model(df)

    # Save
    model_path, data_path = save_improved_model(model, df)

    print("\n" + "="*70)
    print("✅ IMPROVED ML MODEL READY")
    print("="*70)
    print("\nNow the model will HEAVILY consider pause patterns!")
    print("Long pauses between words = Higher risk score")
