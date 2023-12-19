from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from config.settings import conf
from db.database import get_session
from helpers_functions import auth

router = APIRouter(prefix="/api/token")


@router.post("")
async def generate_token(
    data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    user_info = await auth.authenticate_user(data.username, data.password, session)
    if not user_info:
        raise HTTPException(status_code=400, detail="Incorrect data")
    access_token_expires = timedelta(minutes=conf.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user_info.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
