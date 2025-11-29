from pydantic import BaseModel
from typing import List, Optional

class EEGSampleRequest(BaseModel):
    eeg: List[List[float]]
    sampling_rate: Optional[int] = 256

class PredictionResponse(BaseModel):
    status_class: int
    probability: float
    risk_level: str
    model_version: str


class SaveEEGResultRequest(BaseModel):
    user_id: str
    status_class: int
    probability: float
    risk_level: str
    model_version: str
    filename: str = ""
