import pickle


def load_model(path="saved_models/modelo_ingreso.pkl"):
    with open(path, "rb") as f:
        data = pickle.load(f)

    model = data["model"]
    columns = data["columns"]

    return model, columns
