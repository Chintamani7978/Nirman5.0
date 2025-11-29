"""
Initialize the database tables.
Run this script once to create the database schema.
"""
from database import engine, Base
from models.db_models import SpeechTestResult, SentenceRecording, CognitiveGameSession, GameAttempt, EEGTestResult

def init_db():
    """Create all tables in the database"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print(f"Database location: cogni_safe.db")

if __name__ == "__main__":
    init_db()
