def success_response(data=None, message="success"):
	return {
		"success": True,
		"message": message,
		"data": data,
	}
