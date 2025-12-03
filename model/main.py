from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from dotenv import load_dotenv
import os

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[BACKEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo y encoders (usando joblib mejor que pickle)
data = joblib.load("model/modelo_ingreso.pkl")
model = data["model"]
encoders = data["encoders"]


class PredictInput(BaseModel):
    edad: int
    genero: int | str
    departamento: int | str
    provincia: int | str
    distrito: int | str
    tiempo_estudio: int
    horas_diarias: int
    internet: int | str
    dispositivo: int
    situacion_laboral: int
    ingresos: float
    gasto_transporte: float
    gasto_materiales: float
    promedio_colegio: float
    puntaje_simulacro: int
    numero_intentos: int
    motivacion: int
    apoyo_familiar: int
    estres: int
    salud: int
    sueño: int
    tiempo_preparacion_meses: int


@app.post("/predict")
def predict(input_data: PredictInput):
    input_dict = input_data.dict()
    processed = {}

    # Aplicar encoders
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
