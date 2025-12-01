# Dockerfile del modelo
FROM python:3.11-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del modelo
COPY . .

# Comando para correr Flask
# Supongamos que tu app principal se llama app.py y la variable de Flask es app
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

ENV BACKEND_URL=http://backend:3000

CMD ["flask", "run"]
