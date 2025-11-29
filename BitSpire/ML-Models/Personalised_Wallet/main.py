from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
import pickle
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

# Paths (must stay in sync with 03_Model_Training.ipynb)
BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "RandomForest_wallet_model.pkl"
SCALER_PATH = ARTIFACTS_DIR / "scaler.pkl"
ENCODERS_PATH = ARTIFACTS_DIR / "label_encoders.pkl"
FEATURE_COLUMNS_PATH = ARTIFACTS_DIR / "feature_columns.pkl"
NUMERIC_COLS_PATH = ARTIFACTS_DIR / "numeric_cols.pkl"

def load_pickle(path: str):
    with open(path, "rb") as f:
        return pickle.load(f)

model = load_pickle(MODEL_PATH)
scaler = load_pickle(SCALER_PATH)
le_dict = load_pickle(ENCODERS_PATH)
feature_columns = load_pickle(FEATURE_COLUMNS_PATH)
numeric_cols = load_pickle(NUMERIC_COLS_PATH)

class InputData(BaseModel):
    month: int
    year: int
    avg_wallet_balance: float
    avg_session_duration: float = 60.0
    peak_hour_ratio: float = 0.0

    avg_cost: float
    avg_cost_efficiency: float

    city: str
    vehicle_type: str
    subscription_type: str
    payment_mode: str
    charger_type: str

    sessions_per_user_month: float

def preprocess_input(data: InputData) -> np.ndarray:
    """Reproduce the notebook preprocessing for a single record.

    This function assumes that 03_Model_Training.ipynb saved:
    - label_encoders.pkl  (dict[col_name -> fitted LabelEncoder])
    - feature_columns.pkl (list of column names of X after preprocessing)
    - numeric_cols.pkl    (list of numeric columns scaled by StandardScaler)
    """

    cost_per_kwh_est = data.avg_cost_efficiency * data.peak_hour_ratio
    wallet_to_cost_ratio = data.avg_wallet_balance / (data.avg_cost + 1e-6)

    raw = {
        "Month": data.month,
        "Year": data.year,
        "avg_wallet_balance": data.avg_wallet_balance,
        "avg_session_duration": data.avg_session_duration,
        "peak_hour_ratio": data.peak_hour_ratio,
        "City": data.city,
        "Vehicle_Type": data.vehicle_type,
        "Subscription_Type": data.subscription_type,
        "Payment_Mode": data.payment_mode,
        "Charger_Type": data.charger_type,
        "sessions_per_user_month": data.sessions_per_user_month,
        "cost_per_kwh_est": cost_per_kwh_est,
        "wallet_to_cost_ratio": wallet_to_cost_ratio,
        "vehicle_encoded": data.vehicle_type,
        "subscription_encoded": data.subscription_type,
    }

    X = pd.DataFrame([raw])

    for col, encoder in le_dict.items():
        if col in X.columns:
            X[col] = encoder.transform(X[col].astype(str))

    X_numeric = X[numeric_cols]
    X[numeric_cols] = scaler.transform(X_numeric)

    X = X.reindex(columns=feature_columns, fill_value=0)

    return X.values

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # Allow all domains (or specify ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Personalised Wallet Prediction API is running"}

@app.post("/predict")
def predict(data: InputData):
    features = preprocess_input(data)
    prediction = model.predict(features)
    return {"prediction": float(prediction[0])}

class WalletSuggestionRequest(InputData):
    previous_month_spend: float | None = None
    smoothing_factor: float = 0.5

@app.post("/suggest_wallet")
def suggest_wallet(data: WalletSuggestionRequest):
    """Return raw prediction and a smoothed suggested monthly wallet amount.

    If previous_month_spend is provided, we apply simple exponential smoothing:

        suggested = smoothing_factor * prediction \
                    + (1 - smoothing_factor) * previous_month_spend

    Otherwise, suggested == prediction.
    """

    features = preprocess_input(data)
    prediction = float(model.predict(features)[0])

    if data.previous_month_spend is not None:
        alpha = max(0.0, min(1.0, data.smoothing_factor))
        suggested = alpha * prediction + (1 - alpha) * data.previous_month_spend
    else:
        suggested = prediction

    return {
        "prediction": prediction,
        "suggested_monthly_wallet": suggested,
        "previous_month_spend": data.previous_month_spend,
        "smoothing_factor": data.smoothing_factor,
    }
