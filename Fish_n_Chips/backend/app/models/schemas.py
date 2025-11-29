from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SpeechTestRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the user", example="user_123")
    test_type: str = Field("full", description="Type of test to run (full or quick)", example="full")

class SpeechTestResponse(BaseModel):
    session_id: str = Field(..., description="Unique session ID for the test", example="550e8400-e29b-41d4-a716-446655440000")
    stimulus_sentences: List[str] = Field(..., description="List of sentences for the user to repeat")
    initial_volume: float = Field(..., description="Initial volume level (0.0 to 1.0)", example=0.5)

class SpeechAnalysisRequest(BaseModel):
    session_id: str = Field(..., description="Session ID from start-test")
    stimulus_sentence: str = Field(..., description="The sentence the user was trying to repeat")
    audio_end_timestamp: Optional[float] = Field(None, description="Timestamp when recording ended")
    speech_start_timestamp: Optional[float] = Field(None, description="Timestamp when speech started")

class PauseLocation(BaseModel):
    after_word: str = Field(..., description="The word preceding the pause")
    duration: float = Field(..., description="Duration of the pause in seconds")

class SpeechFeatures(BaseModel):
    acoustic_features: Dict[str, Any] = Field(..., description="Extracted acoustic features (pitch, energy, etc.)")
    linguistic_features: Dict[str, Any] = Field(..., description="Extracted linguistic features (word count, etc.)")

class SpeechAnalysisResponse(BaseModel):
    reaction_time_ms: float = Field(..., description="Time taken to start speaking in ms")
    transcription: str = Field(..., description="Transcribed text from audio")
    word_accuracy: float = Field(..., description="Accuracy of transcription vs stimulus (0-100)")
    speech_rate_wpm: float = Field(..., description="Speech rate in words per minute")
    avg_pause_duration: float = Field(..., description="Average duration of pauses in seconds")
    long_pause_count: int = Field(..., description="Number of pauses longer than threshold")
    pause_locations: List[PauseLocation] = Field(..., description="Details of significant pauses")
    risk_score: float = Field(..., description="Calculated dementia risk score (0-100)")
    risk_level: str = Field(..., description="Risk level category (Low, Medium, High)")
    features: SpeechFeatures

class AudiometryRequest(BaseModel):
    frequency_hz: int = Field(..., description="Frequency of the tone played", example=1000)
    volume_level: float = Field(..., description="Volume level of the tone (0.0 to 1.0)", example=0.3)
    user_heard: bool = Field(..., description="Whether the user indicated they heard the tone")

class AudiometryResponse(BaseModel):
    threshold_db: Optional[float] = Field(None, description="Estimated hearing threshold in dB (if found)")
    continue_test: bool = Field(..., description="Whether to continue the test")
    next_volume: Optional[float] = Field(None, description="Next volume level to test")

class SpeechResultsResponse(BaseModel):
    overall_risk_score: float = Field(..., description="Overall dementia risk score")
    reaction_time_score: float = Field(..., description="Score component for reaction time")
    speech_quality_score: float = Field(..., description="Score component for speech quality/accuracy")
    hearing_score: float = Field(..., description="Score component for hearing ability")
    recommendations: List[str] = Field(..., description="List of recommendations based on results")
