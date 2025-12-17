# Proyecto – Minería de Datos

Sistema de minería de datos orientado a evaluar la posibilidad de ingreso de
estudiantes de distintas regiones del Perú a través de la CREPREUNI,
utilizando un modelo de clasificación.

## Objetivo
Aplicar técnicas de minería de datos para analizar características académicas
y socioeducativas de los estudiantes y predecir su posible ingreso mediante
la CREPREUNI.

## Arquitectura
- Frontend: React
- Backend: Node.js + Express
- Modelo: FastAPI (Python)
- Contenedores: Docker

## Ejecución
docker-compose up --build

## Flujo del sistema
1. El usuario ingresa los datos del estudiante en el frontend
2. El backend recibe y valida la información
3. El modelo de minería de datos realiza la clasificación
4. El resultado de la predicción se muestra en la interfaz
