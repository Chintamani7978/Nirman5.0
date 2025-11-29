# Speech Analysis Integration Walkthrough

This document outlines the newly integrated Speech Analysis module for CogniSafe. This feature assesses cognitive health through speech patterns, analyzing reaction time, speech rate, pauses, and linguistic accuracy.

## Features Implemented

### Backend
- **Whisper Integration**: Uses OpenAI's Whisper API for high-accuracy transcription and word-level timestamps.
- **Feature Extraction**:
    - **Acoustic**: Pitch, Energy, MFCCs, Speech Rate (via `librosa`).
    - **Linguistic**: Word count, lexical diversity, part-of-speech distribution (via `spaCy`).
    - **Pause Analysis**: Detects hesitation and long pauses between words.
- **Scoring Engine**: Rule-based system to calculate a dementia risk score based on reaction time, speech rate, pauses, and accuracy.
- **Audiometry**: Adaptive threshold test to rule out hearing loss as a confounding factor.

### Frontend
- **Speech Analysis Tab**: A new dedicated section in the application.
- **Interactive Test Flow**:
    1.  **Instructions**: Clear guidance for the user.
    2.  **Audiometry Check**: A quick hearing test using generated tones.
    3.  **Speech Task**: Users listen to stimulus sentences and repeat them.
    4.  **Real-time Feedback**: Visual reaction timer and audio level meter.
- **Results Dashboard**: Comprehensive report showing risk scores, component breakdown, and recommendations.

## How to Test

1.  **Start the Backend**:
    ```bash
    source venv/bin/activate
    uvicorn backend.app.main:app --reload
    ```
    *Note: Ensure `OPENAI_API_KEY` is set in your `.env` file for real transcription. If missing, the system will use dummy data for demonstration.*

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

3.  **Run the Assessment**:
    - Open the app in your browser (e.g., `http://localhost:5173`).
    - Click on the **Speech Analysis** tab.
    - Click **Start Assessment**.
    - Follow the prompts to complete the hearing check and speech tasks.
    - View your results at the end.

## Testing with Swagger UI

FastAPI provides an interactive API documentation interface (Swagger UI) that you can use to test the backend endpoints directly.

1.  **Access Swagger UI**:
    - Open your browser and navigate to `http://localhost:8000/docs`.
    - You will see a list of all available endpoints, grouped by tags (e.g., `speech`).

2.  **Test Speech Endpoints**:
    - **Start Test**: Expand `POST /api/speech/start-test`, click "Try it out", enter a `user_id`, and execute. Copy the returned `session_id`.
    - **Audiometry**: Expand `POST /api/speech/audiometry`, click "Try it out", enter test values (e.g., `frequency_hz: 1000`, `volume_level: 0.5`, `user_heard: true`), and execute.
    - **Analyze Speech**: Expand `POST /api/speech/analyze`. This requires uploading a file.
        - Click "Try it out".
        - Enter the `session_id` you copied.
        - Enter a `stimulus_sentence` (e.g., "The cat is on the mat").
        - Enter timestamps (e.g., `audio_end_timestamp: 1000`, `speech_start_timestamp: 500`).
        - Upload a small `.wav` file (you can record one using your system recorder or use a sample file).
        - Click "Execute" to see the analysis results (transcription, risk score, features).
    - **Get Results**: Expand `GET /api/speech/results/{session_id}`, enter your `session_id`, and execute to see the final report.

## Architecture

- **`backend/app/services/speech/`**: Contains all logic for VAD, feature extraction, and scoring.
- **`backend/app/routers/speech_analysis.py`**: API endpoints handling the test flow.
- **`frontend/src/components/speech-analysis/`**: React components for the UI.
- **`frontend/src/hooks/`**: Custom hooks (`useAudioRecorder`, `useSpeechAnalysis`) for state management.

## Next Steps (Future Enhancements)
- **ML Model**: Replace rule-based scoring with a trained classifier (Random Forest / XGBoost) using the extracted features.
- **VAD refinement**: Implement server-side VAD for more precise reaction time measurement.
- **Longitudinal Tracking**: Save results to a database to track changes over time.
