# train_model.py
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from github_fetch import fetch_data
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_PATH = os.path.join(MODEL_DIR, "modelo_ingreso.pkl")

# Aseguramos que la carpeta exista
os.makedirs(MODEL_DIR, exist_ok=True)

TARGET = "INGRESO_BIN"

print("📄 Cargando dataset limpio desde GitHub...")
df = fetch_data()

# ================================
# 1. Preparación de datos (MODIFICADO)
# ================================

# DEFINIMOS LAS 15 VARIABLES EXACTAS QUE USA EL FRONTEND
# Esto evita que se cuelen columnas basura del CSV
FEATURES = [
    'EDAD', 
    'SEXO_COD', 
    'N_INTENTOS', 
    'TIEMPO_DESDE_EGRESO', 
    'PUNTAJE_MINEDU',
    'ASISTENCIA', 
    'PARCIAL_1', 
    'PARCIAL_2', 
    'COLEGIO_TIPO_GESTION', 
    'ES_MIGRANTE',
    'EGRESADO_RECIENTE_BIN', 
    'NIVEL_DIFICULTAD', 
    'CALIF_PROMEDIO_HIST',
    'HA_INGRESADO_ANTES', 
    'ANIO_POSTULA'
]

# Verificamos que todas las columnas existan en el CSV antes de seguir
missing_cols = [col for col in FEATURES if col not in df.columns]
if missing_cols:
    raise ValueError(f"❌ El CSV de GitHub no tiene estas columnas requeridas: {missing_cols}")

# Seleccionamos solo las features y el target
X = df[FEATURES]
y = df[TARGET]

# Limpieza básica (llenar vacíos si los hubiera)
X = X.fillna(X.mean())

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"🔧 Variables usadas para entrenamiento ({X_train.shape[1]}):", list(X.columns))

# ================================
# 2. Entrenamiento del modelo
# ================================
print("🤖 Entrenando modelo Random Forest...")
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10, # Subí un poco la profundidad para mejor precisión
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

# ================================
# 3. Evaluación
# ================================
preds = model.predict(X_test)

print("\n📊 Accuracy:", accuracy_score(y_test, preds))
# print("\n📌 Classification Report:")
# print(classification_report(y_test, preds))

# ================================
# 4. Guardar modelo
# ================================
# Guardamos como diccionario para que load_model() funcione bien
packet = {
    "model": model,
    "columns": list(X.columns) # Guardamos los nombres de las columnas para el ordenamiento
}

with open(MODEL_PATH, "wb") as f:
    pickle.dump(packet, f)

print(f"\n✅ Modelo guardado correctamente en: {MODEL_PATH}")