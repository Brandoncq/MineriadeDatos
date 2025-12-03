from fastapi import APIRouter, HTTPException
from models.schemas import PredictInput
from utils.model_utils import load_model

router = APIRouter()

# Cargar modelo al inicio
model, encoders = load_model()


@router.post("/predict")
def predict(input_data: PredictInput):
    input_dict = input_data.dict()
    processed = {}

    for col, value in input_dict.items():
        if col in encoders:
            try:
                processed[col] = encoders[col].transform([value])[0]
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Valor desconocido '{value}' en columna '{col}'"
                )
        else:
            processed[col] = value

    X = [list(processed.values())]
    pred = model.predict(X)[0]

    return {"prediction": int(pred)}
