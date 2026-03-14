from pydantic import BaseModel, ConfigDict


class UserRegister(BaseModel):
	email: str
	password: str


class UserLogin(BaseModel):
	email: str
	password: str


class UserOut(BaseModel):
	id: int
	email: str
	role: str

	model_config = ConfigDict(from_attributes=True)
