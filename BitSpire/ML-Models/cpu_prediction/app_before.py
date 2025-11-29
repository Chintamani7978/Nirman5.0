from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated, Literal
import pickle
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Load trained model
# Load trained model
MODEL_PATH = os.path.join(BASE_DIR, "pickle_files", "model_before.pkl")
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "cpu_before.csv")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# Load dataset once to get dummy column structure
df = pd.read_csv(DATASET_PATH)
numerical_features = [
    "AC_Charging_kW","DC_Charging_kW","AC_FullCharge_hr","DC_10_80_min",
    "Battery_Capacity_kWh","Range_km","Launch_Year"
]
categorical_features = ["Brand","Segment"]
target = "FullChargeCost_Rs"

data = df[numerical_features + categorical_features + [target]].copy()
X = pd.get_dummies(data, columns=categorical_features, drop_first=True)
expected_columns = X.drop(columns=[target]).columns  # save training feature names

app = FastAPI(title="EV Charging Cost Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to specific domains like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)


class UserInput(BaseModel):
    Brand: str
    Segment: str
    Battery_Capacity_kWh: Annotated[float, Field(..., gt=0, lt=220)]
    Range_km: Annotated[float, Field(..., gt=150, lt=1100)]
    AC_Charging_kW: Annotated[float, Field(..., gt=0, lt=12)]
    DC_Charging_kW: Annotated[float, Field(..., gt=0, lt=350)]
    AC_FullCharge_hr: Annotated[float, Field(..., gt=0, lt=20)]
    DC_10_80_min: Annotated[float, Field(..., gt=0, lt=60)]
    # Price_Rs: Annotated[float, Field(..., gt=100000, lt=20000000)]
    Launch_Year: Annotated[int, Field(..., gt=2018, lt=2026)]

@app.post("/predict")
def predict_cost(ev: UserInput):
    try:
        # Convert input to DataFrame
        input_df = pd.DataFrame([ev.dict()])

        # Apply same preprocessing
        input_processed = pd.get_dummies(input_df, columns=categorical_features, drop_first=True)

        # Align with training columns
        for col in expected_columns:
            if col not in input_processed.columns:
                input_processed[col] = 0
        input_processed = input_processed[expected_columns]

        # Predict
        prediction = model.predict(input_processed)[0]

        return {
            "Predicted_FullChargeCost_Rs": round(prediction, 2),
            "Inputs": ev.dict()
        }
    except Exception as e:
        return {"error": str(e), "inputs": ev.dict()}