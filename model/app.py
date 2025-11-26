from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Cargar modelo
with open("modelo_ingreso.pkl", "rb") as f:
    model = pickle.load(f)


@app.route("/predict", methods=["POST"])
def predict():
    features = request.json  # recibe JSON del cuerpo
    X = [list(features.values())]
    pred = model.predict(X)[0]
    return jsonify({"prediction": int(pred)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
