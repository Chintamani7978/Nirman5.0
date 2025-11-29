"""
API endpoints for cognitive games
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
import random
from typing import List

from backend.app.database import get_db
from backend.app.models.game_schemas import (
    GameStartRequest, GameStartResponse,
    GameSubmitRequest, GameResultResponse,
    CognitiveGamesResultsResponse
)
from backend.app.models.db_models import CognitiveGameSession, GameAttempt

router = APIRouter(
    prefix="/api/games",
    tags=["cognitive-games"]
)

# Game configurations
MEMORY_MATCH_CONFIG = {
    "num_pairs": 6,
    "cards": ["🍎", "🍌", "🍇", "🍊", "🍓", "🍉"],  # 6 pairs = 12 cards total
    "time_limit_seconds": 120
}

STROOP_TEST_CONFIG = {
    "num_trials": 20,
    "words": ["RED", "BLUE", "GREEN", "YELLOW"],
    "colors": ["red", "blue", "green", "yellow"],
    "time_limit_seconds": 60
}

TRAIL_MAKING_CONFIG = {
    "part_a_nodes": 8,  # Numbers 1-8
    "part_b_nodes": 9,  # 1-A-2-B-3-C-4-D-5
    "time_limit_seconds": 180
}

PATTERN_RECOGNITION_CONFIG = {
    "num_patterns": 10,
    "time_limit_seconds": 120
}

@router.post("/start", response_model=GameStartResponse)
async def start_game(request: GameStartRequest, db: Session = Depends(get_db)):
    """
    Start a new cognitive game session
    """
    session_id = str(uuid.uuid4())

    # Get game configuration
    if request.game_type == "memory_match":
        game_config = MEMORY_MATCH_CONFIG.copy()
        # Shuffle and duplicate cards for matching
        cards = game_config["cards"] * 2  # Duplicate each card
        random.shuffle(cards)
        game_config["shuffled_cards"] = cards

    elif request.game_type == "stroop_test":
        game_config = STROOP_TEST_CONFIG.copy()
        # Generate trials (word-color pairs)
        trials = []
        for _ in range(game_config["num_trials"]):
            word = random.choice(game_config["words"])
            color = random.choice(game_config["colors"])
            trials.append({"word": word, "color": color})
        game_config["trials"] = trials

    elif request.game_type == "trail_making":
        game_config = TRAIL_MAKING_CONFIG.copy()

    elif request.game_type == "pattern_recognition":
        game_config = PATTERN_RECOGNITION_CONFIG.copy()

    else:
        raise HTTPException(status_code=400, detail=f"Unknown game type: {request.game_type}")

    # Create database session
    db_session = CognitiveGameSession(
        session_id=session_id,
        user_id=request.user_id,
        game_type=request.game_type,
        game_config=game_config
    )
    db.add(db_session)
    db.commit()

    return GameStartResponse(
        session_id=session_id,
        game_type=request.game_type,
        game_config=game_config
    )


@router.post("/submit", response_model=GameResultResponse)
async def submit_game(request: GameSubmitRequest, db: Session = Depends(get_db)):
    """
    Submit game results and calculate scores
    """
    # Get session
    session = db.query(CognitiveGameSession).filter(
        CognitiveGameSession.session_id == request.session_id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Calculate metrics
    total_attempts = len(request.attempts)
    correct_attempts = sum(1 for a in request.attempts if a.get("is_correct", False))
    accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0

    # Calculate average reaction time
    reaction_times = [a.get("reaction_time_ms", 0) for a in request.attempts if a.get("reaction_time_ms")]
    avg_reaction_time = sum(reaction_times) / len(reaction_times) if reaction_times else 0

    # Calculate score based on game type
    if request.game_type == "memory_match":
        score = calculate_memory_match_score(accuracy, avg_reaction_time, request.errors, request.total_time_ms)
        cognitive_metrics = {
            "memory_score": score,
            "attention_score": max(0, 100 - (request.errors * 10)),
            "processing_speed_score": calculate_speed_score(avg_reaction_time)
        }
    elif request.game_type == "stroop_test":
        score = calculate_stroop_score(accuracy, avg_reaction_time)
        cognitive_metrics = {
            "attention_score": score,
            "executive_function_score": accuracy,
            "processing_speed_score": calculate_speed_score(avg_reaction_time)
        }
    elif request.game_type == "trail_making":
        score = calculate_trail_making_score(accuracy, avg_reaction_time, request.total_time_ms, request.errors)
        cognitive_metrics = {
            "executive_function_score": score,
            "attention_score": max(0, 100 - (request.errors * 15)),
            "processing_speed_score": calculate_speed_score(avg_reaction_time)
        }
    elif request.game_type == "pattern_recognition":
        score = calculate_pattern_score(accuracy, avg_reaction_time)
        cognitive_metrics = {
            "executive_function_score": score,
            "attention_score": accuracy,
            "processing_speed_score": calculate_speed_score(avg_reaction_time)
        }
    else:
        score = accuracy
        cognitive_metrics = {}

    # Determine performance level
    if score >= 80:
        performance_level = "Excellent"
    elif score >= 60:
        performance_level = "Good"
    elif score >= 40:
        performance_level = "Fair"
    else:
        performance_level = "Poor"

    # Update session
    session.completed = True
    session.total_time_ms = request.total_time_ms
    session.total_attempts = total_attempts
    session.correct_attempts = correct_attempts
    session.errors = request.errors
    session.accuracy = accuracy
    session.avg_reaction_time_ms = avg_reaction_time
    session.score = score
    session.performance_level = performance_level
    session.attempts_data = request.attempts

    # Update cognitive metrics
    session.memory_score = cognitive_metrics.get("memory_score")
    session.attention_score = cognitive_metrics.get("attention_score")
    session.executive_function_score = cognitive_metrics.get("executive_function_score")
    session.processing_speed_score = cognitive_metrics.get("processing_speed_score")

    db.commit()

    return GameResultResponse(
        session_id=request.session_id,
        game_type=request.game_type,
        score=score,
        accuracy=accuracy,
        avg_reaction_time_ms=avg_reaction_time,
        performance_level=performance_level,
        cognitive_metrics=cognitive_metrics
    )


@router.get("/results/{user_id}", response_model=CognitiveGamesResultsResponse)
async def get_user_results(user_id: str, db: Session = Depends(get_db)):
    """
    Get aggregated cognitive games results for a user
    """
    sessions = db.query(CognitiveGameSession).filter(
        CognitiveGameSession.user_id == user_id,
        CognitiveGameSession.completed == True
    ).all()

    if not sessions:
        raise HTTPException(status_code=404, detail="No completed games found")

    # Aggregate scores
    overall_score = sum(s.score for s in sessions) / len(sessions)

    # Aggregate cognitive domain scores
    memory_scores = [s.memory_score for s in sessions if s.memory_score is not None]
    attention_scores = [s.attention_score for s in sessions if s.attention_score is not None]
    executive_scores = [s.executive_function_score for s in sessions if s.executive_function_score is not None]
    speed_scores = [s.processing_speed_score for s in sessions if s.processing_speed_score is not None]

    memory_score = sum(memory_scores) / len(memory_scores) if memory_scores else 0
    attention_score = sum(attention_scores) / len(attention_scores) if attention_scores else 0
    executive_function_score = sum(executive_scores) / len(executive_scores) if executive_scores else 0
    processing_speed_score = sum(speed_scores) / len(speed_scores) if speed_scores else 0

    # Generate recommendations
    recommendations = []
    if memory_score < 50:
        recommendations.append("Consider memory training exercises")
    if attention_score < 50:
        recommendations.append("Practice attention and focus tasks")
    if processing_speed_score < 50:
        recommendations.append("Work on reaction time with speed-based games")
    if overall_score < 60:
        recommendations.append("Consult a specialist for cognitive assessment")
    else:
        recommendations.append("Cognitive performance is within normal range")

    return CognitiveGamesResultsResponse(
        overall_score=overall_score,
        memory_score=memory_score,
        attention_score=attention_score,
        executive_function_score=executive_function_score,
        processing_speed_score=processing_speed_score,
        recommendations=recommendations
    )


# Helper functions
def calculate_memory_match_score(accuracy: float, avg_reaction_time: float, errors: int, total_time_ms: int) -> float:
    """Calculate score for memory match game"""
    # Base score from accuracy
    score = accuracy

    # Penalty for slow reaction time (>2000ms is slow)
    if avg_reaction_time > 2000:
        score -= min(20, (avg_reaction_time - 2000) / 100)

    # Penalty for errors
    score -= errors * 5

    # Bonus for fast completion (<60s is fast)
    if total_time_ms < 60000:
        score += 10

    return max(0, min(100, score))


def calculate_stroop_score(accuracy: float, avg_reaction_time: float) -> float:
    """Calculate score for Stroop test"""
    # Base score from accuracy
    score = accuracy

    # Penalty for slow reaction time (>1500ms is slow for Stroop)
    if avg_reaction_time > 1500:
        score -= min(15, (avg_reaction_time - 1500) / 100)

    # Bonus for fast reaction (<800ms is excellent)
    if avg_reaction_time < 800:
        score += 10

    return max(0, min(100, score))



def calculate_speed_score(avg_reaction_time: float) -> float:
    """Calculate processing speed score from reaction time"""
    # Excellent: <800ms = 100
    # Good: 800-1500ms = 70-100
    # Fair: 1500-2500ms = 40-70
    # Poor: >2500ms = 0-40

    if avg_reaction_time < 800:
        return 100
    elif avg_reaction_time < 1500:
        return 100 - ((avg_reaction_time - 800) / 700 * 30)
    elif avg_reaction_time < 2500:
        return 70 - ((avg_reaction_time - 1500) / 1000 * 30)
    else:
        return max(0, 40 - ((avg_reaction_time - 2500) / 1000 * 10))


def calculate_trail_making_score(accuracy: float, avg_reaction_time: float, total_time_ms: int, errors: int) -> float:
    """Calculate score for Trail Making test"""
    # Base score from accuracy
    base_score = accuracy

    # Time penalty (Part A+B should take 60-120 seconds total)
    total_time_sec = total_time_ms / 1000
    if total_time_sec < 60:
        time_bonus = 10
    elif total_time_sec < 90:
        time_bonus = 5
    elif total_time_sec < 120:
        time_bonus = 0
    else:
        time_bonus = -((total_time_sec - 120) / 10)  # -1 per 10 seconds over

    # Error penalty
    error_penalty = errors * 5

    # Reaction time component
    speed_component = calculate_speed_score(avg_reaction_time) * 0.3

    final_score = base_score + time_bonus - error_penalty + (speed_component * 0.2)
    return max(0, min(100, final_score))


def calculate_pattern_score(accuracy: float, avg_reaction_time: float) -> float:
    """Calculate score for Pattern Recognition test"""
    # Heavily weighted on accuracy (pattern recognition is about correctness)
    accuracy_weight = 0.7
    speed_weight = 0.3

    speed_component = calculate_speed_score(avg_reaction_time)

    final_score = (accuracy * accuracy_weight) + (speed_component * speed_weight)
    return max(0, min(100, final_score))
