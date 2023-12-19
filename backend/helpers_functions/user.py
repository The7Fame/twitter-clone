from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from config.settings import conf
from db.database import get_session
from models_app import models
from schemas_app import schemas
from init_logger import logger_info


async def get_users_db(curr_user, session: AsyncSession):
    execute = await session.execute(
        select(models.User).where(models.User.username != curr_user)
    )
    logger_info.info("get users from the database")
    return execute.scalars().all()


async def get_user_db(username: str, session: AsyncSession):

    execute = await session.execute(
        select(models.User).where(models.User.username == username)
    )
    logger_info.info(f"get user {username} from the database")
    return execute.scalars().first()


async def get_current_user(
    token: str = Depends(conf.oauth2_scheme),
    session: AsyncSession = Depends(get_session),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, conf.SECRET_KEY, algorithms=[conf.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user_info = await get_user_db(username=token_data.username, session=session)
    if user_info is None:
        raise credentials_exception
    return user_info


async def get_user_following(id_user: int, session: AsyncSession):
    exec = await session.execute(
        select(models.Follower)
        .options(selectinload(models.Follower.user_info_whom))
        .where(models.Follower.who_id == id_user)
    )
    res = exec.scalars().all()
    await session.close()
    if res:
        logger_info.info(f"user {id_user} followings")
        return [user.user_info_whom.to_json() for user in res]
    else:
        logger_info.info(f"user {id_user} no followings")
        return [{"id": 0, "name": "Nobody"}]


async def get_user_followers(id_user: int, session: AsyncSession):
    exec = await session.execute(
        select(models.Follower)
        .options(selectinload(models.Follower.user_info_who))
        .where(models.Follower.whom_id == id_user)
    )
    res = exec.scalars().all()
    await session.close()
    if res:
        logger_info.info(f"user {id_user} followers")
        return [user.user_info_who.to_json() for user in res]
    else:
        logger_info.info(f"user {id_user} no followers")
        return [{"id": 0, "name": "Nobody"}]


async def get_user_by_id(user_id: int, session: AsyncSession):
    execute = await session.execute(
        select(models.User).where(models.User.id == user_id)
    )
    logger_info.info(f"get user {user_id}")
    return execute.scalars().first()
