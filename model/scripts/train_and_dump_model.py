from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import pickle

CSV_URL = "https://github.com/chavez-dev/proyecto_mineria_datos/blob/main/dataset.csv"

# 1. Cargar datos
df = pd.read_csv(CSV_URL, sep=None, engine="python")

# 2. Convertir TODAS las columnas de texto a números
df_encoded = df.copy()
encoder = LabelEncoder()

encoders = {}

for col in df_encoded.columns:
    if df_encoded[col].dtype == "object":
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col])
        encoders[col] = le

# 3. Separar variables
X = df_encoded.drop("INGRESO", axis=1)
y = df_encoded["INGRESO"]

# 4. Entrenar modelo
model = RandomForestClassifier()
model.fit(X, y)

# 5. Guardar modelo
with open("modelo_ingreso.pkl", "wb") as f:
    pickle.dump({"model": model, "encoders": encoders}, f)
