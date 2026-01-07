from fastapi import APIRouter
from model.user import User
from db.mongodb import users_collection
from fastapi.encoders import jsonable_encoder

router = APIRouter()