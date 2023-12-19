from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from helpers_functions import follow, user
from schemas_app import schemas

router = APIRouter(prefix="/api/users")


@router.get("", response_model=List[schemas.UserOut])
async def users_except_current_user(
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    return await user.get_users_db(access_user.username, session)


@router.post("/{whom_user}/follow", response_model=schemas.FollowUser)
async def follow_user(
    whom_user: int,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    if whom_user == access_user.id:
        return {"result": False}
    return await follow.follow_user(access_user.id, whom_user, session)


@router.delete("/{whom_user}/follow", response_model=schemas.UnSubscribeUser)
async def unsubscribe_user(
    whom_user: int,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    if whom_user == access_user.id:
        return {"result": False}
    return await follow.unfollow_user(access_user.id, whom_user, session)


@router.get("/me", response_model=schemas.UserInfo)
async def user_info(
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    followers = await user.get_user_followers(access_user.id, session)
    followings = await user.get_user_following(access_user.id, session)
    return {
        "result": True,
        "user": {
            "id": access_user.id,
            "name": access_user.name,
            "followers": followers,
            "following": followings,
        },
    }


@router.get("/{id_user}", response_model=schemas.UserInfo)
async def user_by_id(
    id_user: int,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    user_info_current = await user.get_user_by_id(id_user, session)
    follower = await user.get_user_followers(user_info_current.id, session)
    following = await user.get_user_following(user_info_current.id, session)
    return {
        "result": True,
        "user": {
            "id": user_info_current.id,
            "name": user_info_current.name,
            "followers": follower,
            "following": following,
        },
    }
