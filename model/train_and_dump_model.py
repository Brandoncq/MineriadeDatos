from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import pickle

# 1. Cargar datos
df = pd.read_csv("data.csv")

X = df.drop("churn", axis=1)
y = df["churn"]

# 2. Crear el modelo
model = RandomForestClassifier()

# 3. Entrenar
model.fit(X, y)

# 4. Guardar como archivo .pkl
with open("modelo_churn.pkl", "wb") as f:
    pickle.dump(model, f)
