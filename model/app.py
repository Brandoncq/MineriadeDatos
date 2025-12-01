from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from dotenv import load_dotenv
import os

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")

app = Flask(__name__)
CORS(app, resources={
     r"/*": {"origins": [BACKEND_URL]}}, supports_credentials=True)

# Cargar modelo y encoders
with open("model/modelo_ingreso.pkl", "rb") as f:
    data = pickle.load(f)

model = data["model"]
encoders = data["encoders"]


@app.route("/predict", methods=["POST"])
def predict():
    input_data = request.json  # recibe JSON del cuerpo
    processed = {}

    # Convertir texto a número usando los encoders
    for col, value in input_data.items():
        if col in encoders:
            try:
                processed[col] = encoders[col].transform([value])[0]
            except ValueError:
                return jsonify({"error": f"Valor desconocido '{value}' en columna '{col}'"}), 400
        else:
            processed[col] = value  # ya es numérico

    # Preparar datos para el modelo
    X = [list(processed.values())]
    pred = model.predict(X)[0]

    return jsonify({"prediction": int(pred)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
