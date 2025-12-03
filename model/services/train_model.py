# train_model.py
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from github_fetch import fetch_data
import os

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)))  # /model
MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_PATH = os.path.join(MODEL_DIR, "modelo_ingreso.pkl")

TARGET = "INGRESO_BIN"

print("📄 Cargando dataset limpio desde GitHub...")
df = fetch_data()  # <--- AQUÍ SE USA TU FUNCIÓN

# ================================
# 1. Preparación de datos
# ================================
COLUMNAS_A_ELIMINAR = [
    TARGET,
    "CALIF_FINAL",
    "FACULTAD_COD"
]

X = df.drop(columns=[c for c in COLUMNAS_A_ELIMINAR if c in df.columns])
y = df[TARGET]

X = X.fillna(X.mean())

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("🔧 Variables usadas para entrenamiento:", X_train.shape[1])

# ================================
# 2. Entrenamiento del modelo
# ================================
print("🤖 Entrenando modelo Random Forest...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=5,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

# ================================
# 3. Evaluación
# ================================
preds = model.predict(X_test)

print("\n📊 Accuracy:", accuracy_score(y_test, preds))
print("\n📌 Classification Report:")
print(classification_report(y_test, preds))

# ================================
# 4. Guardar modelo
# ================================
with open(MODEL_PATH, "wb") as f:
    pickle.dump({
        "model": model,
        "columns": list(X.columns)
    }, f)

print(f"\n✅ Modelo guardado como: {MODEL_PATH}")
