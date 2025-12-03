from fastapi import APIRouter, HTTPException
from models.schemas import PredictInput
from utils.model_utils import load_model
import numpy as np
import pandas as pd

router = APIRouter()

# Cargar modelo al inicio
model, columns = load_model()


@router.post("/predict")
def predict(input_data: PredictInput):
    input_dict = input_data.dict()

    for col in columns:
        if col not in input_dict:
            raise HTTPException(
                status_code=400, detail=f"Falta la columna: {col}")

    # Convertir a DataFrame con columnas correctas
    X = pd.DataFrame([input_dict], columns=columns)

    # Predicción
    pred = model.predict(X)[0]
    proba = model.predict_proba(X)[0][1]

    return {
        "prediction": int(pred),
        "probability": round(proba * 100, 2)
    }
