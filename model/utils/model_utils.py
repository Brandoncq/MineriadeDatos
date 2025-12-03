import joblib


def load_model(path="saved_models/modelo_ingreso.pkl"):
    data = joblib.load(path)
    model = data["model"]
    encoders = data["encoders"]
    return model, encoders
