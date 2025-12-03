import pandas as pd

CSV_URL = "https://raw.githubusercontent.com/chavez-dev/proyecto_mineria_datos/main/datos_cepre_preparados_final.csv"


def fetch_data():
    df = pd.read_csv(CSV_URL)
    return df
