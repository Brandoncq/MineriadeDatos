from fastapi import FastAPI
import pickle

app = FastAPI()

with open("modelo_churn.pkl", "rb") as f:
    model = pickle.load(f)


@app.post("/predict")
def predict(features: dict):
    X = [list(features.values())]
    pred = model.predict(X)[0]
    return {"prediction": int(pred)}
