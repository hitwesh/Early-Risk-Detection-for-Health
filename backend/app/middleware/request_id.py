import uuid

from fastapi import Request

from app.core.logger import logger


async def add_request_id(request: Request, call_next):
	request_id = str(uuid.uuid4())
	request.state.request_id = request_id

	response = await call_next(request)
	response.headers["X-Request-ID"] = request_id
	logger.info(
		"{method} {path} {status_code} request_id={request_id}",
		method=request.method,
		path=request.url.path,
		status_code=response.status_code,
		request_id=request_id,
	)
	return response
