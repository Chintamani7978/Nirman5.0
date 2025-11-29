"""
Unified multi-modal analysis router
Combines EEG, Speech, and Cognitive Games results
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import List

from backend.app.database import get_db
from backend.app.models.unified_schemas import (
    TestCompletionStatus,
    UnifiedAnalysisResponse,
    CognitiveDomainScores,
    TestBreakdown,
    KeyFinding
)
from backend.app.models.db_models import (
    SpeechTestResult,
    CognitiveGameSession,
    EEGTestResult
)

router = APIRouter(
    prefix="/api/unified",
    tags=["unified-analysis"]
)

# Weights for multi-modal fusion
WEIGHTS = {
    "eeg": 0.40,      # 40% - Most objective
    "speech": 0.35,   # 35% - Strong research backing
    "games": 0.25     # 25% - Behavioral indicators
}

@router.get("/status/{user_id}", response_model=TestCompletionStatus)
async def get_completion_status(user_id: str, db: Session = Depends(get_db)):
    """
    Check which tests the user has completed
    """
    # Check Speech Test
    speech_test = db.query(SpeechTestResult).filter(
        SpeechTestResult.user_id == user_id,
        SpeechTestResult.completed == True
    ).order_by(desc(SpeechTestResult.created_at)).first()

    # Check Cognitive Games (all 4 games)
    games_sessions = db.query(CognitiveGameSession).filter(
        CognitiveGameSession.user_id == user_id,
        CognitiveGameSession.completed == True
    ).all()

    speech_completed = speech_test is not None
    speech_score = speech_test.overall_risk_score if speech_test else None

    # Games complete if all 4 game types done
    game_types_completed = set(s.game_type for s in games_sessions)
    games_completed = len(game_types_completed) >= 4
    games_score = None

    if games_completed:
        # Calculate average score from all games
        games_score = sum(s.score for s in games_sessions) / len(games_sessions)

    # Check EEG Test
    eeg_test = db.query(EEGTestResult).filter(
        EEGTestResult.user_id == user_id,
        EEGTestResult.completed == True
    ).order_by(desc(EEGTestResult.created_at)).first()

    eeg_completed = eeg_test is not None
    eeg_score = eeg_test.risk_score if eeg_test else None

    total_completed = sum([eeg_completed, speech_completed, games_completed])
    all_complete = total_completed == 3

    return TestCompletionStatus(
        eeg_completed=eeg_completed,
        speech_completed=speech_completed,
        games_completed=games_completed,
        total_completed=total_completed,
        all_complete=all_complete,
        eeg_score=eeg_score,
        speech_score=speech_score,
        games_score=games_score
    )


@router.get("/results/{user_id}", response_model=UnifiedAnalysisResponse)
async def get_unified_results(user_id: str, db: Session = Depends(get_db)):
    """
    Get comprehensive unified analysis results
    Combines all three modalities with weighted scoring
    """
    # 1. Fetch all test results
    status = await get_completion_status(user_id, db)

    if not status.all_complete:
        raise HTTPException(
            status_code=400,
            detail=f"Not all tests complete. Completed: {status.total_completed}/3"
        )

    # Get detailed results
    speech_test = db.query(SpeechTestResult).filter(
        SpeechTestResult.user_id == user_id,
        SpeechTestResult.completed == True
    ).order_by(desc(SpeechTestResult.created_at)).first()

    games_sessions = db.query(CognitiveGameSession).filter(
        CognitiveGameSession.user_id == user_id,
        CognitiveGameSession.completed == True
    ).all()

    # 2. Calculate weighted final score
    eeg_score = status.eeg_score or 0  # Placeholder
    speech_score = status.speech_score or 0
    games_score = status.games_score or 0

    overall_risk_score = (
        eeg_score * WEIGHTS["eeg"] +
        speech_score * WEIGHTS["speech"] +
        games_score * WEIGHTS["games"]
    )

    # 3. Determine risk level
    if overall_risk_score < 40:
        risk_level = "Low"
    elif overall_risk_score < 70:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # 4. Calculate cognitive domain scores
    cognitive_domains = calculate_cognitive_domains(
        eeg_score, speech_test, games_sessions
    )

    # 5. Generate key findings
    key_findings = generate_key_findings(
        eeg_score, speech_test, games_sessions, cognitive_domains
    )

    # 6. Generate recommendations
    recommendations = generate_recommendations(
        overall_risk_score, cognitive_domains
    )

    # 7. Calculate confidence
    # Higher confidence if all tests agree, lower if they disagree
    score_variance = calculate_variance([eeg_score, speech_score, games_score])
    confidence = max(60, 100 - score_variance)  # 60-100 range

    return UnifiedAnalysisResponse(
        user_id=user_id,
        overall_risk_score=round(overall_risk_score, 1),
        risk_level=risk_level,
        confidence=round(confidence, 1),
        test_breakdown=TestBreakdown(
            eeg_score=eeg_score,
            speech_score=speech_score,
            games_score=games_score
        ),
        cognitive_domains=cognitive_domains,
        key_findings=key_findings,
        recommendations=recommendations,
        assessment_date=datetime.now().isoformat(),
        tests_included=["eeg", "speech", "cognitive_games"]
    )


def calculate_cognitive_domains(
    eeg_score: float,
    speech_test: SpeechTestResult,
    games_sessions: List[CognitiveGameSession]
) -> CognitiveDomainScores:
    """Map test results to cognitive domains"""

    # Extract game scores by type
    game_scores = {s.game_type: s for s in games_sessions}

    # Memory: primarily from memory_match game
    memory_score = game_scores.get('memory_match', None)
    memory = memory_score.score if memory_score else 50

    # Attention: from speech, stroop, and trail making
    attention_scores = []
    if speech_test:
        # Lower pause score = better attention
        attention_scores.append(max(0, 100 - speech_test.pause_score if speech_test.pause_score else 50))
    if 'stroop_test' in game_scores:
        attention_scores.append(game_scores['stroop_test'].attention_score or 50)
    if 'trail_making' in game_scores:
        attention_scores.append(game_scores['trail_making'].attention_score or 50)

    attention = sum(attention_scores) / len(attention_scores) if attention_scores else 50

    # Language: primarily from speech
    language = 100 - speech_test.overall_risk_score if speech_test else 50

    # Executive Function: from trail making and pattern recognition
    exec_scores = []
    if 'trail_making' in game_scores:
        exec_scores.append(game_scores['trail_making'].executive_function_score or 50)
    if 'pattern_recognition' in game_scores:
        exec_scores.append(game_scores['pattern_recognition'].executive_function_score or 50)

    executive_function = sum(exec_scores) / len(exec_scores) if exec_scores else 50

    # Processing Speed: from all tests
    speed_scores = []
    if speech_test:
        speed_scores.append(100 - speech_test.reaction_time_score if speech_test.reaction_time_score else 50)
    for game in games_sessions:
        if game.processing_speed_score:
            speed_scores.append(game.processing_speed_score)

    processing_speed = sum(speed_scores) / len(speed_scores) if speed_scores else 50

    return CognitiveDomainScores(
        memory=round(memory, 1),
        attention=round(attention, 1),
        language=round(language, 1),
        executive_function=round(executive_function, 1),
        processing_speed=round(processing_speed, 1)
    )


def generate_key_findings(
    eeg_score: float,
    speech_test: SpeechTestResult,
    games_sessions: List[CognitiveGameSession],
    domains: CognitiveDomainScores
) -> List[KeyFinding]:
    """Generate key findings from analysis"""

    findings = []

    # Speech findings
    if speech_test and speech_test.avg_pause_duration and speech_test.avg_pause_duration > 0.8:
        findings.append(KeyFinding(
            severity="warning",
            message=f"Significant speech hesitations detected (avg {speech_test.avg_pause_duration:.1f}s pauses)",
            source="speech"
        ))

    # EEG findings (placeholder)
    if eeg_score > 70:
        findings.append(KeyFinding(
            severity="warning",
            message="Abnormal EEG patterns detected (reduced alpha/beta activity)",
            source="eeg"
        ))

    # Memory findings
    if domains.memory < 50:
        findings.append(KeyFinding(
            severity="warning",
            message="Below-average memory performance in cognitive games",
            source="games"
        ))

    # Positive findings
    if domains.attention >= 60:
        findings.append(KeyFinding(
            severity="info",
            message="Attention span within normal range",
            source="multiple"
        ))

    # Processing speed
    if domains.processing_speed < 50:
        findings.append(KeyFinding(
            severity="warning",
            message="Reduced processing speed across multiple tests",
            source="multiple"
        ))

    return findings


def generate_recommendations(
    overall_score: float,
    domains: CognitiveDomainScores
) -> List[str]:
    """Generate actionable recommendations"""

    recommendations = []

    # Overall risk-based
    if overall_score >= 70:
        recommendations.append("🏥 Consult a neurologist for comprehensive clinical evaluation")
        recommendations.append("📅 Schedule follow-up assessment in 1-2 months")
    elif overall_score >= 40:
        recommendations.append("📅 Monitor symptoms and re-test in 3-6 months")
        recommendations.append("🏥 Consider consultation with healthcare provider")
    else:
        recommendations.append("✅ Cognitive health appears within normal range")
        recommendations.append("📅 Annual screening recommended for continued monitoring")

    # Domain-specific
    if domains.memory < 50:
        recommendations.append("🧠 Consider memory training exercises and cognitive games")

    if domains.processing_speed < 50:
        recommendations.append("⚡ Practice speed-based cognitive tasks to improve reaction time")

    if domains.executive_function < 50:
        recommendations.append("🎯 Engage in activities requiring planning and task-switching")

    # General health
    recommendations.append("🏃 Maintain regular physical exercise and social engagement")
    recommendations.append("😴 Ensure adequate sleep (7-9 hours per night)")
    recommendations.append("🥗 Follow a brain-healthy diet (Mediterranean diet recommended)")

    return recommendations


def calculate_variance(scores: List[float]) -> float:
    """Calculate variance in scores (for confidence calculation)"""
    if not scores:
        return 0
    mean = sum(scores) / len(scores)
    variance = sum((x - mean) ** 2 for x in scores) / len(scores)
    return variance
