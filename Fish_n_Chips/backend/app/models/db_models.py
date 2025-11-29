from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.database import Base

class SpeechTestResult(Base):
    """Main table for speech test results"""
    __tablename__ = "speech_test_results"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(String(255), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Test metadata
    test_type = Column(String(50), default="full")
    completed = Column(Boolean, default=False)
    user_consented = Column(Boolean, default=False)  # Privacy consent

    # Audiometry
    hearing_threshold_db = Column(Integer)

    # Overall scores
    overall_risk_score = Column(Float)
    risk_level = Column(String(20))

    # Component scores
    reaction_time_score = Column(Float)
    speech_quality_score = Column(Float)
    accuracy_score = Column(Float)
    pause_score = Column(Float)

    # Aggregated metrics
    avg_reaction_time_ms = Column(Float)
    avg_speech_rate_wpm = Column(Float)
    avg_pause_duration = Column(Float)
    avg_word_accuracy = Column(Float)

    # Raw data (JSON)
    sentence_results = Column(JSON)  # List of all sentence results
    acoustic_features = Column(JSON)  # Aggregated acoustic features
    linguistic_features = Column(JSON)  # Aggregated linguistic features

    # Labels for ML (optional, added later by clinician)
    ground_truth_label = Column(String(50))  # e.g., "healthy", "mci", "alzheimers"
    verified_by = Column(String(255))
    verified_at = Column(DateTime(timezone=True))

    # Relationship
    recordings = relationship("SentenceRecording", back_populates="test_result", cascade="all, delete-orphan")


class SentenceRecording(Base):
    """Individual sentence recordings and analysis"""
    __tablename__ = "sentence_recordings"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), ForeignKey("speech_test_results.session_id"), nullable=False)
    sentence_index = Column(Integer, nullable=False)
    stimulus_sentence = Column(Text, nullable=False)

    # Recording metadata
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    duration_seconds = Column(Float)

    # Analysis results
    transcription = Column(Text)
    word_accuracy = Column(Float)
    reaction_time_ms = Column(Float)
    speech_rate_wpm = Column(Float)
    avg_pause_duration = Column(Float)
    long_pause_count = Column(Integer)

    # Features
    acoustic_features = Column(JSON)
    linguistic_features = Column(JSON)
    pause_locations = Column(JSON)

    # Risk assessment
    risk_score = Column(Float)
    risk_level = Column(String(20))

    # Audio file path (optional - not storing audio by default for privacy)
    audio_file_path = Column(String(500))

    # Relationship
    test_result = relationship("SpeechTestResult", back_populates="recordings")


class CognitiveGameSession(Base):
    """Cognitive games test session"""
    __tablename__ = "cognitive_game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, nullable=False, index=True)
    user_id = Column(String(255), index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Game metadata
    game_type = Column(String(50), nullable=False)  # "memory_match", "stroop_test", etc.
    completed = Column(Boolean, default=False)

    # Performance metrics
    total_time_ms = Column(Integer)
    total_attempts = Column(Integer)
    correct_attempts = Column(Integer)
    errors = Column(Integer)

    # Scores
    accuracy = Column(Float)  # Percentage
    avg_reaction_time_ms = Column(Float)
    score = Column(Float)  # 0-100
    performance_level = Column(String(20))  # "Excellent", "Good", "Fair", "Poor"

    # Cognitive metrics
    memory_score = Column(Float)
    attention_score = Column(Float)
    executive_function_score = Column(Float)
    processing_speed_score = Column(Float)

    # Raw data
    game_config = Column(JSON)  # Game configuration used
    attempts_data = Column(JSON)  # All attempts with timestamps

    # Relationship
    attempts = relationship("GameAttempt", back_populates="session", cascade="all, delete-orphan")


class GameAttempt(Base):
    """Individual attempt within a game"""
    __tablename__ = "game_attempts"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), ForeignKey("cognitive_game_sessions.session_id"), nullable=False)
    attempt_number = Column(Integer, nullable=False)

    # Attempt data
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())
    reaction_time_ms = Column(Integer)
    is_correct = Column(Boolean)

    # Game-specific data
    stimulus = Column(JSON)  # What was shown (e.g., card positions, word/color)
    user_response = Column(JSON)  # What user did

    # Relationship
    session = relationship("CognitiveGameSession", back_populates="attempts")


class EEGTestResult(Base):
    """Table for EEG test results"""
    __tablename__ = "eeg_test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Analysis results
    status_class = Column(Integer)  # 0 or 1
    probability = Column(Float)  # 0.0 to 1.0
    risk_level = Column(String(20))  # Low, Medium, High
    risk_score = Column(Float)  # 0-100 (probability * 100)
    model_version = Column(String(50))

    # File metadata
    filename = Column(String(255))
    file_type = Column(String(10))  # csv, edf, json

    # Completed flag
    completed = Column(Boolean, default=True)
