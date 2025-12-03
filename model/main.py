from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router
from dotenv import load_dotenv
import os

load_dotenv()
BACKEND_URL = os.getenv("BACKEND_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[BACKEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
