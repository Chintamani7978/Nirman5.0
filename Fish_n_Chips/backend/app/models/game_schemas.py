"""
Pydantic schemas for cognitive games API
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GameStartRequest(BaseModel):
    user_id: str
    game_type: str  # "memory_match", "stroop_test", "trail_making"

class GameStartResponse(BaseModel):
    session_id: str
    game_type: str
    game_config: dict

class MemoryMatchAttempt(BaseModel):
    card1_index: int
    card2_index: int
    is_match: bool
    time_taken_ms: int

class StroopTestAttempt(BaseModel):
    word: str
    color: str
    user_response: str
    is_correct: bool
    reaction_time_ms: int

class GameSubmitRequest(BaseModel):
    session_id: str
    game_type: str
    attempts: List[dict]  # List of attempts (MemoryMatch or StroopTest)
    total_time_ms: int
    errors: int

class GameResultResponse(BaseModel):
    session_id: str
    game_type: str
    score: float  # 0-100
    accuracy: float
    avg_reaction_time_ms: float
    performance_level: str  # "Excellent", "Good", "Fair", "Poor"
    cognitive_metrics: dict

class CognitiveGamesResultsResponse(BaseModel):
    overall_score: float
    memory_score: float
    attention_score: float
    executive_function_score: float
    processing_speed_score: float
    recommendations: List[str]
