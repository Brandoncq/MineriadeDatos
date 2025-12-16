# train_model.py

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
# Importación de la función externa para cargar datos
from github_fetch import fetch_data 

# Nota: La función 'fetch_data()' se asume que existe y carga el DataFrame. 
# Si el CSV está localmente en producción, esta parte debe ajustarse
# a la ruta local (ej. pd.read_csv('data/datos_cepre_preparados_final.csv')).

# =============================================================================
# CONFIGURACIÓN DE RUTAS Y CONSTANTES
# =============================================================================
# Asumiendo una estructura de proyecto, ajusta estas rutas a tu servidor de producción
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_PATH = os.path.join(MODEL_DIR, "modelo_ingreso.pkl")

# Aseguramos que la carpeta de modelos exista
os.makedirs(MODEL_DIR, exist_ok=True)

TARGET = "INGRESO_BIN"
UMBRAL = 0.65  # Umbral ajustado al 65% para maximizar Precisión

# =============================================================================
# 1. CARGA Y PREPARACIÓN DE DATOS
# =============================================================================
print("📄 Cargando dataset limpio...")
try:
    # Usamos pd.read_csv para replicar tu carga original de Colab, 
    # pero debes ajustarla si usas 'fetch_data()' en producción.
    # df = fetch_data() # Si usas función externa
    df = fetch_data()
    print(f"✅ Datos cargados. Filas: {df.shape[0]}, Columnas: {df.shape[1]}")
except Exception as e:
    print(f"❌ Error cargando datos: {e}")
    exit()

# DEFINIMOS LAS 15 VARIABLES EXACTAS
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

# Selección y limpieza de variables
X = df[FEATURES].copy()
y = df[TARGET]

# Limpieza de seguridad (rellenar nulos con media)
X = X.fillna(X.mean())

# División Train/Test (80% / 20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"🔧 Variables usadas ({len(FEATURES)}): OK")
print(f"📊 Tamaño de entrenamiento: {X_train.shape[0]} filas")

# =============================================================================
# 2. ENTRENAMIENTO DEL MODELO (Sincronizado con Colab)
# =============================================================================
print("\n🤖 Entrenando modelo Random Forest...")

model = RandomForestClassifier(
    n_estimators=200,        
    max_depth=12,            
    min_samples_leaf=4,      
    max_features='sqrt',
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
print("✅ Entrenamiento finalizado.")

# =============================================================================
# 3. EVALUACIÓN Y MÉTRICAS (Aplicando Umbral de 65%)
# =============================================================================
print("\n📊 EVALUACIÓN DEL MODELO:")

# Obtenemos la probabilidad de la clase positiva (Ingreso)
y_proba = model.predict_proba(X_test)[:, 1]

# Aplicamos el umbral de 0.65 para generar las predicciones binarias
y_pred_ajustado = (y_proba >= UMBRAL).astype(int) 

# Métricas Numéricas
acc = accuracy_score(y_test, y_pred_ajustado)
auc = roc_auc_score(y_test, y_proba)

print(f"   -> Umbral aplicado: {UMBRAL*100:.0f}%")
print(f"   -> Accuracy (Con Umbral {UMBRAL*100:.0f}%): {acc:.4f}")
print(f"   -> ROC AUC (Independiente del Umbral):  {auc:.4f}")

print("\n📌 Reporte de Clasificación:")
# Usamos y_pred_ajustado
print(classification_report(y_test, y_pred_ajustado, target_names=['No Ingresa', 'Ingresa']))

print("\n📌 Matriz de Confusión (Texto):")
# Usamos y_pred_ajustado
cm = confusion_matrix(y_test, y_pred_ajustado)
print(f"   [Umbral {UMBRAL*100:.0f}%]")
print(f"   TN (Verdaderos Negativos): {cm[0][0]:<5} | FP (Falsos Positivos): {cm[0][1]}")
print(f"   FN (Falsos Negativos):     {cm[1][0]:<5} | TP (Verdaderos Positivos): {cm[1][1]}")

# =============================================================================
# 4. IMPORTANCIA DE VARIABLES (Texto)
# =============================================================================
print("\n🌟 PESO DE LAS VARIABLES (Top 10):")
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]

for i in range(10): # Mostrar solo las 10 más importantes
    var_name = FEATURES[indices[i]]
    var_weight = importances[indices[i]]
    print(f"   {i+1}. {var_name:<25} : {var_weight:.4f}")

# =============================================================================
# 5. GUARDADO DEL MODELO
# =============================================================================
packet = {
    "model": model,
    "columns": FEATURES, # Guardamos la lista para garantizar el orden en el backend
    "umbral_produccion": UMBRAL # Guardamos el umbral para usarlo en el servicio de predicción
}

with open(MODEL_PATH, "wb") as f:
    pickle.dump(packet, f)

print("-" * 50)
print(f"✅ MODELO GUARDADO EXITOSAMENTE")
print(f"📂 Ruta: {MODEL_PATH}")
print("-" * 50)