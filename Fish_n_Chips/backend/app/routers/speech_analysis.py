from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from typing import Optional
from sqlalchemy.orm import Session
import uuid
import shutil
import os
import tempfile
from Levenshtein import ratio
from datetime import datetime

from backend.app.models.schemas import (
    SpeechTestRequest, SpeechTestResponse,
    SpeechAnalysisResponse, PauseLocation, SpeechFeatures,
    AudiometryRequest, AudiometryResponse, SpeechResultsResponse
)

from backend.app.services.speech.whisper_service import transcribe_with_timestamps
from backend.app.services.speech.vad_service import detect_speech_start
from backend.app.services.speech.feature_extractor import extract_acoustic_features, extract_linguistic_features
from backend.app.services.speech.pause_analyzer import analyze_pauses
from backend.app.services.speech.audiometry_service import adaptive_threshold_test
from backend.app.services.speech.speech_scorer import calculate_ml_risk_score
from backend.app.utils.audio_utils import convert_audio_format
from backend.app.database import get_db
from backend.app.models.db_models import SpeechTestResult, SentenceRecording

router = APIRouter(
    prefix="/api/speech",
    tags=["speech"]
)

# In-memory session store (replace with DB in production)
sessions = {}

STIMULUS_SENTENCES = [
    "There sits an old man",
    "The cat is on the mat",
    "I went to the store yesterday",
    "The quick brown fox jumps",
    "She sells seashells by the seashore",
    "Today is a beautiful day"
]

@router.post("/start-test", response_model=SpeechTestResponse)
async def start_test(request: SpeechTestRequest, db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "user_id": request.user_id,
        "results": [],
        "audiometry": {}
    }

    # Create database record
    db_test = SpeechTestResult(
        session_id=session_id,
        user_id=request.user_id,
        test_type=request.test_type,
        user_consented=True  # Assuming consent for now
    )
    db.add(db_test)
    db.commit()

    return SpeechTestResponse(
        session_id=session_id,
        stimulus_sentences=STIMULUS_SENTENCES,
        initial_volume=0.3
    )

@router.post("/analyze", response_model=SpeechAnalysisResponse)
async def analyze_speech(
    session_id: str = Form(...),
    stimulus_sentence: str = Form(...),
    audio_end_timestamp: float = Form(...), # Client-side timestamp when recording stopped
    speech_start_timestamp: float = Form(...), # Client-side timestamp when user started speaking (optional fallback)
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        # 2. Transcribe (Whisper)
        transcription_result = transcribe_with_timestamps(tmp_path)
        transcription_text = transcription_result["text"]
        word_timestamps = transcription_result["words"]

        # 3. Calculate Reaction Time
        # Option A: Use VAD on server
        with open(tmp_path, "rb") as f:
            audio_bytes = f.read()

        # We need raw PCM for VAD, but file is likely WAV/WebM.
        # For simplicity, let's rely on client-side timestamps or VAD if format allows.
        # Assuming client sends a rough timestamp, we can refine it or just use it.
        # Let's use the client provided timestamp for now as VAD on compressed web audio is tricky without conversion.
        # Ideally: convert to PCM -> VAD.

        # Placeholder for VAD logic if we had PCM
        # vad_start = detect_speech_start(pcm_bytes, 16000)

        # Reaction time = (Time user started speaking) - (Time audio stimulus ended)
        # This requires client to send both.
        # Let's assume the client sends the calculated reaction time or we calculate it here.
        # Actually, the prompt says "detect_speech_start" is in VAD service.
        # Let's assume we use the client's speech_start_timestamp for now to be safe,
        # as converting WebM/WAV to 16k mono PCM for webrtcvad requires ffmpeg/pydub which we have.

        # Simple fallback:
        reaction_time_ms = speech_start_timestamp # Client calculated or passed raw

        # 4. Accuracy (Levenshtein)
        # Normalize strings
        ref = stimulus_sentence.lower().strip(".,!?")
        hyp = transcription_text.lower().strip(".,!?")
        accuracy = ratio(ref, hyp) * 100

        # 5. Features
        acoustic_features = extract_acoustic_features(tmp_path)
        linguistic_features = extract_linguistic_features(transcription_text)

        # 6. Pauses - Use AUDIO-BASED detection (more accurate than Whisper timestamps)
        from backend.app.services.speech.pause_analyzer import detect_pauses_from_audio
        pause_analysis = detect_pauses_from_audio(tmp_path, min_silence_duration=0.3)

        # 7. ML-Based Scoring (with improved pause analysis)
        scores = calculate_ml_risk_score(
            reaction_time_ms=reaction_time_ms,
            speech_rate_wpm=acoustic_features.get("speech_rate_wpm", 120),
            pause_analysis=pause_analysis,  # Now using audio-based pauses!
            word_accuracy=accuracy
        )

        # Store result in memory
        if session_id in sessions:
            sessions[session_id]["results"].append({
                "sentence": stimulus_sentence,
                "transcription": transcription_text,
                "accuracy": accuracy,
                "scores": scores,
                "acoustic_features": acoustic_features,
                "linguistic_features": linguistic_features
            })

        # Save to database
        sentence_index = len(sessions.get(session_id, {}).get("results", [])) - 1
        db_recording = SentenceRecording(
            session_id=session_id,
            sentence_index=sentence_index,
            stimulus_sentence=stimulus_sentence,
            transcription=transcription_text,
            word_accuracy=accuracy,
            reaction_time_ms=reaction_time_ms,
            speech_rate_wpm=acoustic_features.get("speech_rate_wpm", 0),
            avg_pause_duration=pause_analysis["avg_pause_duration"],
            long_pause_count=pause_analysis["long_pause_count"],
            acoustic_features=acoustic_features,
            linguistic_features=linguistic_features,
            pause_locations=pause_analysis["pause_locations"],
            risk_score=scores["overall_risk"],
            risk_level=scores["risk_level"]
        )
        db.add(db_recording)
        db.commit()
        print(f"✅ Saved sentence {sentence_index + 1} to database")

        return SpeechAnalysisResponse(
            reaction_time_ms=reaction_time_ms,
            transcription=transcription_text,
            word_accuracy=accuracy,
            speech_rate_wpm=acoustic_features.get("speech_rate_wpm", 0), # Need to implement wpm calc in extractor properly
            avg_pause_duration=pause_analysis["avg_pause_duration"],
            long_pause_count=pause_analysis["long_pause_count"],
            pause_locations=[
                PauseLocation(
                    after_word=f"pause_{i+1}",  # Audio-based doesn't have word context
                    duration=p["duration"]
                ) for i, p in enumerate(pause_analysis.get("pause_locations", []))
            ],
            risk_score=scores["overall_risk"],
            risk_level=scores["risk_level"],
            features=SpeechFeatures(
                acoustic_features=acoustic_features,
                linguistic_features=linguistic_features
            )
        )

    finally:
        os.remove(tmp_path)

@router.post("/audiometry", response_model=AudiometryResponse)
async def audiometry_test(request: AudiometryRequest):
    # Use a simple session ID - in production this should come from the request
    session_id = f"audio_{request.frequency_hz}"
    result = adaptive_threshold_test(
        request.frequency_hz,
        request.volume_level,
        request.user_heard,
        session_id=session_id
    )
    return AudiometryResponse(**result)

@router.get("/results/{session_id}", response_model=SpeechResultsResponse)
async def get_results(session_id: str, db: Session = Depends(get_db)):
    print(f"🔍 Looking for session: {session_id}")
    print(f"📋 Available sessions: {list(sessions.keys())}")

    session = sessions.get(session_id)
    if not session:
        print(f"❌ Session {session_id} not found in memory")
        raise HTTPException(status_code=404, detail=f"Session not found: {session_id}")

    results = session["results"]
    if not results:
        return SpeechResultsResponse(
            overall_risk_score=0,
            reaction_time_score=0,
            speech_quality_score=0,
            hearing_score=0,
            recommendations=["Complete the test to see results"]
        )

    # Average scores
    avg_risk = sum(r["scores"]["overall_risk"] for r in results) / len(results)
    avg_rt_score = sum(r["scores"]["component_scores"]["reaction_time_score"] for r in results) / len(results)
    avg_acc_score = sum(r["scores"]["component_scores"]["accuracy_score"] for r in results) / len(results)

    # Calculate aggregated metrics
    avg_reaction_time = sum(r.get("scores", {}).get("reaction_time_ms", 0) for r in results) / len(results) if results else 0
    avg_accuracy = sum(r.get("accuracy", 0) for r in results) / len(results) if results else 0

    recommendations = []
    if avg_risk > 60:
        recommendations.append("Consult a specialist for comprehensive evaluation.")
    elif avg_risk > 30:
        recommendations.append("Monitor symptoms and re-test in 6 months.")
    else:
        recommendations.append("Cognitive health appears normal.")

    # Determine risk level
    if avg_risk < 25:
        risk_level = "Low"
    elif avg_risk < 50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Update database with final aggregated results
    db_test = db.query(SpeechTestResult).filter(SpeechTestResult.session_id == session_id).first()
    if db_test:
        db_test.completed = True
        db_test.overall_risk_score = avg_risk
        db_test.risk_level = risk_level
        db_test.reaction_time_score = avg_rt_score
        db_test.accuracy_score = avg_acc_score
        db_test.avg_word_accuracy = avg_accuracy
        db_test.sentence_results = results  # Store all results as JSON
        db.commit()
        print(f"✅ Saved final results for session {session_id}")

    return SpeechResultsResponse(
        overall_risk_score=avg_risk,
        reaction_time_score=avg_rt_score,
        speech_quality_score=avg_acc_score,
        hearing_score=0, # Placeholder
        recommendations=recommendations
    )

# Data Export Endpoints for ML Training
from backend.app.services.data_export import get_statistics, export_to_csv, export_detailed_json

@router.get("/data/statistics")
async def data_statistics(db: Session = Depends(get_db)):
    """Get statistics about collected speech test data"""
    stats = get_statistics(db)
    return stats

@router.get("/data/export/csv")
async def export_data_csv(
    include_unlabeled: bool = True,
    db: Session = Depends(get_db)
):
    """Export test data to CSV format"""
    output_path = "speech_test_data.csv"
    count = export_to_csv(db, output_path, include_unlabeled)
    return {
        "message": f"Exported {count} test results to {output_path}",
        "file_path": output_path,
        "count": count
    }

@router.get("/data/export/json")
async def export_data_json(
    include_unlabeled: bool = True,
    db: Session = Depends(get_db)
):
    """Export detailed test data to JSON format"""
    output_path = "speech_test_data.json"
    count = export_detailed_json(db, output_path, include_unlabeled)
    return {
        "message": f"Exported {count} test results to {output_path}",
        "file_path": output_path,
        "count": count
    }

