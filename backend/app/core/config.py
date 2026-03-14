from pydantic_settings import BaseSettings


class Settings(BaseSettings):
	APP_NAME: str = "SymptoScan API"
	APP_VERSION: str = "1.0"

	DATABASE_URL: str
	MODEL_PATH: str
	JWT_SECRET: str
	JWT_ALGORITHM: str = "HS256"
	ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

	class Config:
		env_file = ".env"
		extra = "ignore"


settings = Settings()
