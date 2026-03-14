from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.core.logger import logger


class APIException(Exception):
	def __init__(self, message: str, status_code: int = status.HTTP_400_BAD_REQUEST):
		self.message = message
		self.status_code = status_code


async def api_exception_handler(request: Request, exc: APIException):
	return JSONResponse(
		status_code=exc.status_code,
		content={
			"success": False,
			"error": exc.message,
		},
	)


async def unhandled_exception_handler(request: Request, exc: Exception):
	logger.opt(exception=exc).error("Unhandled exception")
	return JSONResponse(
		status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
		content={
			"success": False,
			"error": "Internal server error",
		},
	)
