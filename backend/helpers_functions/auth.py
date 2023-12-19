from datetime import datetime, timedelta
from typing import Union
from fastapi import Depends
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from config.settings import conf
from db.database import get_session
from helpers_functions import user
from init_logger import logger_info, logger_error


async def get_password_hash(password):
    logger_info.info("get password hash")
    return conf.pwd_context.hash(password)


async def verify_password(plain_password, hashed_password):
    logger_info.info("verify password")
    return conf.pwd_context.verify(plain_password, hashed_password)


async def authenticate_user(
    username, password, session: AsyncSession = Depends(get_session)
):
    user_info = await user.get_user_db(username, session)
    if not user_info:
        logger_error.error("no user in the database")
        return False
    if not await verify_password(password, user_info.pass_hash):
        logger_error.error("password is not verified")
        return False
    return user_info


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(conf.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, conf.SECRET_KEY, algorithm=conf.ALGORITHM)
    logger_info.info("created token")
    return encoded_jwt
