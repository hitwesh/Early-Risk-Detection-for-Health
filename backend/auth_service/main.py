from fastapi import FastAPI

app = FastAPI(title="Auth Service")

@app.get("/")
def health():
    return {"status": "auth service running"}