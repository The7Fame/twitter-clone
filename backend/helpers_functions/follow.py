from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models_app import models
from init_logger import logger_info, logger_error


async def exist_user_or_not(whom_id, session: AsyncSession):
    exec = await session.execute(select(models.User).where(models.User.id == whom_id))
    res = exec.scalars().first()
    return res


async def check_follow_or_not(who_id: int, whom_id: int, session: AsyncSession):
    exec = await session.execute(
        select(models.Follower).where(
            models.Follower.who_id == who_id, models.Follower.whom_id == whom_id
        )
    )
    res = exec.scalars().first()
    return res


async def unfollow_user(who_id: int, whom_id: int, session: AsyncSession):
    exist_or_not = await exist_user_or_not(whom_id, session)
    if exist_or_not:
        info = await check_follow_or_not(who_id, whom_id, session)
        if info:
            q = delete(models.Follower).where(
                models.Follower.who_id == who_id,
                models.Follower.whom_id == whom_id,
            )
            await session.execute(q)
            await session.commit()
            await session.close()
            logger_info.info(f"user {who_id} unfollow user {whom_id}")
            return {"result": True}
        else:
            logger_error.error(
                f"user {who_id} has been already unfollow user or haven't follow user {whom_id}"
            )

            return {"result": False}
    else:
        logger_error.error(f"no user {whom_id}")
        return {"result": False}


async def follow_user(who_id: int, whom_id: int, session: AsyncSession):
    exist_or_not = await exist_user_or_not(whom_id, session)
    if exist_or_not:
        info = await check_follow_or_not(who_id, whom_id, session)
        if info is None:
            session.add(models.Follower(who_id=who_id, whom_id=whom_id))
            await session.commit()
            logger_info.info(f"user {who_id} follow user{whom_id}")
            return {"result": True}
        else:
            logger_error.error(f"user {who_id} has been already follow user {whom_id}")
            return {"result": False}
    else:
        logger_error.error(f"no user {whom_id}")
        return {"result": False}
