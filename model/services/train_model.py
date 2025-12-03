from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import joblib
from services.github_fetch import fetch_data

# 1. Cargar datos (ya puede estar en data/)
df = fetch_data()

# 2. Convertir columnas de texto a números
df_encoded = df.copy()
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

# 5. Guardar modelo en saved_models/
joblib.dump({"model": model, "encoders": encoders},
            "saved_models/modelo_ingreso.pkl")
