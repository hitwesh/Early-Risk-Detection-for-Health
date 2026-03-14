from pydantic import BaseModel


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

	class Config:
		from_attributes = True
