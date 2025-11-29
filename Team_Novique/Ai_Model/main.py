from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os
from Syllabus_analyser.ocr import extract_text
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for testing/deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "✅ Waste Classifier API is running!"}

@app.post("/extractedSyallabus")
async def predict(file: UploadFile = File(...)):
    image_data = await file.read()
    res = extract_text(image_data)
    return JSONResponse({
        "filename": file.filename,
        "predictedText": res
    })