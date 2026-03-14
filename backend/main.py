from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.diagnosis import router as diagnosis_router
from app.api.v1.routes.users import router as user_router
from app.core.config import settings
from app.core.exceptions import (
    APIException,
    api_exception_handler,
    unhandled_exception_handler,
)
from app.core.logger import logger
from app.core.response import success_response
from app.db.base import Base
from app.db.database import engine
from app.middleware.request_id import add_request_id
from app.middleware.security_headers import add_security_headers

@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("Backend server started")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"],
)

app.middleware("http")(add_request_id)
app.middleware("http")(add_security_headers)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(diagnosis_router)


@app.get("/")
def root():
    return {"message": "SymptoScan API running"}


@app.get("/health")
def health():
    return success_response({"status": "ok"}, message="healthy")


@app.get("/ready")
def readiness():
    return success_response({"status": "ready"}, message="ready")
