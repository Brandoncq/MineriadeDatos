import pandas as pd

CSV_URL = "https://github.com/chavez-dev/proyecto_mineria_datos/blob/main/dataset.csv"
DATA_PATH = "data/dataset.csv"


def fetch_data():
    df = pd.read_csv(CSV_URL, sep=None, engine="python")
    df.to_csv(DATA_PATH, index=False)
    return df
