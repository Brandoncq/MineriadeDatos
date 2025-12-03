FROM python:3.11-slim

WORKDIR /app

# Copiar dependencias
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código
COPY . .

# Variables de entorno
ENV BACKEND_URL=http://backend:3000

# Exponer puerto FastAPI
EXPOSE 5000

# Comando para correr FastAPI con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
