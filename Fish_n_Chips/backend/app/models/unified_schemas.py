"""
Pydantic schemas for unified multi-modal analysis
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class TestCompletionStatus(BaseModel):
    """Status of individual test completion"""
    eeg_completed: bool = Field(..., description="Whether EEG test is complete")
    speech_completed: bool = Field(..., description="Whether speech test is complete")
    games_completed: bool = Field(..., description="Whether cognitive games are complete")
    total_completed: int = Field(..., description="Number of tests completed (0-3)")
    all_complete: bool = Field(..., description="Whether all tests are complete")

    # Individual scores (null if not completed)
    eeg_score: Optional[float] = Field(None, description="EEG risk score (0-100)")
    speech_score: Optional[float] = Field(None, description="Speech risk score (0-100)")
    games_score: Optional[float] = Field(None, description="Games overall score (0-100)")

class CognitiveDomainScores(BaseModel):
    """Scores for specific cognitive domains"""
    memory: float = Field(..., description="Memory domain score (0-100)", ge=0, le=100)
    attention: float = Field(..., description="Attention domain score (0-100)", ge=0, le=100)
    language: float = Field(..., description="Language domain score (0-100)", ge=0, le=100)
    executive_function: float = Field(..., description="Executive function score (0-100)", ge=0, le=100)
    processing_speed: float = Field(..., description="Processing speed score (0-100)", ge=0, le=100)

class TestBreakdown(BaseModel):
    """Breakdown of scores by test"""
    eeg_score: float = Field(..., description="EEG contribution to final score")
    speech_score: float = Field(..., description="Speech contribution to final score")
    games_score: float = Field(..., description="Games contribution to final score")
    eeg_weight: float = Field(0.40, description="Weight applied to EEG")
    speech_weight: float = Field(0.35, description="Weight applied to Speech")
    games_weight: float = Field(0.25, description="Weight applied to Games")

class KeyFinding(BaseModel):
    """Individual key finding from analysis"""
    severity: str = Field(..., description="Severity level: 'warning', 'info', 'success'")
    message: str = Field(..., description="Finding description")
    source: str = Field(..., description="Which test(s) contributed: 'eeg', 'speech', 'games', 'multiple'")

class UnifiedAnalysisResponse(BaseModel):
    """Complete unified analysis results"""
    user_id: str = Field(..., description="User identifier")

    # Overall assessment
    overall_risk_score: float = Field(..., description="Weighted combined risk score (0-100)", ge=0, le=100)
    risk_level: str = Field(..., description="Risk category: 'Low', 'Medium', 'High'")
    confidence: float = Field(..., description="Confidence in assessment (0-100)", ge=0, le=100)

    # Breakdown
    test_breakdown: TestBreakdown = Field(..., description="Score breakdown by test")

    # Cognitive domains
    cognitive_domains: CognitiveDomainScores = Field(..., description="Domain-specific scores")

    # Findings and recommendations
    key_findings: List[KeyFinding] = Field(..., description="Important findings from analysis")
    recommendations: List[str] = Field(..., description="Actionable recommendations")

    # Metadata
    assessment_date: str = Field(..., description="Date of assessment completion")
    tests_included: List[str] = Field(..., description="Which tests were included in analysis")
