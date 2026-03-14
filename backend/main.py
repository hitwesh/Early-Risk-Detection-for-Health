from fastapi import FastAPI

app = FastAPI(
	title="SymptoScan API",
	version="1.0",
)


@app.get("/")
def root():
	return {"message": "SymptoScan backend running"}
