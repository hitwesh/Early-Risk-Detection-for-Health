from fastapi import FastAPI

from app.api.v1.routes.auth import router as auth_router
from app.core.config import settings
from app.core.logger import logger
from app.db.base import Base
from app.db.database import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(auth_router, prefix="/auth")


@app.on_event("startup")
def startup_event():
    logger.info("Backend server started")


@app.get("/")
def root():
    return {"message": "SymptoScan API running"}
