from fastapi import FastAPI

from app.core.config import settings
from app.core.logger import logger

app = FastAPI(
	title=settings.APP_NAME,
	version=settings.APP_VERSION,
)


@app.on_event("startup")
def startup_event():
	logger.info("Backend server started")


@app.get("/")
def root():
	return {"message": "SymptoScan API running"}
