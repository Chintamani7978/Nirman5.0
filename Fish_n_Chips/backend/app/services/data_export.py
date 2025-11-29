"""
Data export service for ML training.
Exports speech test data in formats suitable for machine learning.
"""
from sqlalchemy.orm import Session
from backend.app.models.db_models import SpeechTestResult, SentenceRecording
from typing import List, Dict, Any
import csv
import json
from datetime import datetime

def export_to_csv(db: Session, output_path: str, include_unlabeled: bool = True):
    """
    Export test results to CSV format for ML training.

    Args:
        db: Database session
        output_path: Path to save CSV file
        include_unlabeled: Whether to include tests without ground truth labels
    """
    query = db.query(SpeechTestResult).filter(SpeechTestResult.completed == True)

    if not include_unlabeled:
        query = query.filter(SpeechTestResult.ground_truth_label.isnot(None))

    results = query.all()

    with open(output_path, 'w', newline='') as csvfile:
        fieldnames = [
            'session_id', 'user_id', 'created_at',
            'overall_risk_score', 'risk_level',
            'avg_reaction_time_ms', 'avg_speech_rate_wpm',
            'avg_pause_duration', 'avg_word_accuracy',
            'hearing_threshold_db',
            'ground_truth_label', 'verified_by', 'verified_at'
        ]

        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for result in results:
            writer.writerow({
                'session_id': result.session_id,
                'user_id': result.user_id,
                'created_at': result.created_at,
                'overall_risk_score': result.overall_risk_score,
                'risk_level': result.risk_level,
                'avg_reaction_time_ms': result.avg_reaction_time_ms,
                'avg_speech_rate_wpm': result.avg_speech_rate_wpm,
                'avg_pause_duration': result.avg_pause_duration,
                'avg_word_accuracy': result.avg_word_accuracy,
                'hearing_threshold_db': result.hearing_threshold_db,
                'ground_truth_label': result.ground_truth_label,
                'verified_by': result.verified_by,
                'verified_at': result.verified_at
            })

    return len(results)


def export_detailed_json(db: Session, output_path: str, include_unlabeled: bool = True):
    """
    Export detailed test results including all features to JSON.

    Args:
        db: Database session
        output_path: Path to save JSON file
        include_unlabeled: Whether to include tests without ground truth labels
    """
    query = db.query(SpeechTestResult).filter(SpeechTestResult.completed == True)

    if not include_unlabeled:
        query = query.filter(SpeechTestResult.ground_truth_label.isnot(None))

    results = query.all()

    export_data = []
    for result in results:
        # Get all sentence recordings for this test
        recordings = db.query(SentenceRecording).filter(
            SentenceRecording.session_id == result.session_id
        ).order_by(SentenceRecording.sentence_index).all()

        export_data.append({
            'session_id': result.session_id,
            'user_id': result.user_id,
            'created_at': result.created_at.isoformat() if result.created_at else None,
            'test_metadata': {
                'test_type': result.test_type,
                'hearing_threshold_db': result.hearing_threshold_db,
                'user_consented': result.user_consented
            },
            'aggregated_scores': {
                'overall_risk_score': result.overall_risk_score,
                'risk_level': result.risk_level,
                'reaction_time_score': result.reaction_time_score,
                'accuracy_score': result.accuracy_score,
                'pause_score': result.pause_score
            },
            'aggregated_metrics': {
                'avg_reaction_time_ms': result.avg_reaction_time_ms,
                'avg_speech_rate_wpm': result.avg_speech_rate_wpm,
                'avg_pause_duration': result.avg_pause_duration,
                'avg_word_accuracy': result.avg_word_accuracy
            },
            'sentence_recordings': [
                {
                    'index': rec.sentence_index,
                    'stimulus': rec.stimulus_sentence,
                    'transcription': rec.transcription,
                    'metrics': {
                        'word_accuracy': rec.word_accuracy,
                        'reaction_time_ms': rec.reaction_time_ms,
                        'speech_rate_wpm': rec.speech_rate_wpm,
                        'avg_pause_duration': rec.avg_pause_duration,
                        'long_pause_count': rec.long_pause_count
                    },
                    'features': {
                        'acoustic': rec.acoustic_features,
                        'linguistic': rec.linguistic_features,
                        'pause_locations': rec.pause_locations
                    },
                    'risk': {
                        'score': rec.risk_score,
                        'level': rec.risk_level
                    }
                }
                for rec in recordings
            ],
            'ground_truth': {
                'label': result.ground_truth_label,
                'verified_by': result.verified_by,
                'verified_at': result.verified_at.isoformat() if result.verified_at else None
            }
        })

    with open(output_path, 'w') as f:
        json.dump(export_data, f, indent=2)

    return len(export_data)


def get_statistics(db: Session) -> Dict[str, Any]:
    """Get statistics about collected data"""
    total_tests = db.query(SpeechTestResult).count()
    completed_tests = db.query(SpeechTestResult).filter(SpeechTestResult.completed == True).count()
    labeled_tests = db.query(SpeechTestResult).filter(SpeechTestResult.ground_truth_label.isnot(None)).count()
    total_recordings = db.query(SentenceRecording).count()

    return {
        'total_tests': total_tests,
        'completed_tests': completed_tests,
        'labeled_tests': labeled_tests,
        'unlabeled_tests': completed_tests - labeled_tests,
        'total_recordings': total_recordings,
        'ready_for_ml': labeled_tests >= 100  # Arbitrary threshold
    }
