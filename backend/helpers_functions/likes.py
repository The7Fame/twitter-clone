from sqlalchemy import delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models_app import models
from init_logger import logger_info, logger_error


async def exist_tweet_or_not(tweet_id: int, session: AsyncSession):
    q = await session.execute(select(models.Tweet).where(models.Tweet.id == tweet_id))
    res = q.scalars().first()
    await session.close()
    return res


async def check_exist_like_or_not(tweet_id, who_id, session: AsyncSession):
    exec = await session.execute(
        select(models.Likes).where(
            models.Likes.tweet_id == tweet_id, models.Likes.who_id == who_id
        )
    )
    res = exec.scalars().first()
    await session.close()
    return res


async def update_likes_positive(tweet_id: int, who_id: int, session: AsyncSession):
    tweet_exist_or_not = await exist_tweet_or_not(tweet_id, session)
    if tweet_exist_or_not:
        info = await check_exist_like_or_not(tweet_id, who_id, session)
        if info is None:
            session.add(models.Likes(who_id=who_id, tweet_id=tweet_id))
            await session.flush()
            q = (
                update(models.Tweet)
                .where(models.Tweet.id == tweet_id)
                .values(likes_count=1 + models.Tweet.likes_count)
            )
            await session.execute(q)
            await session.commit()
            logger_info.info(f"user {who_id} liked tweet {tweet_id}")
            return {"result": True}
        else:
            logger_error.error(f"tweet {tweet_id} do not exist")
            return {"result": False}
    else:
        logger_error.error(f"user {who_id} has been already liked tweet {tweet_id}")
        return {"result": False}


async def update_likes_negative(tweet_id: int, who_id: int, session: AsyncSession):
    tweet_exist_or_not = await exist_tweet_or_not(tweet_id, session)
    if tweet_exist_or_not:
        info = await check_exist_like_or_not(tweet_id, who_id, session)
        if info:
            q = (
                update(models.Tweet)
                .where(models.Tweet.id == tweet_id)
                .values(likes_count=models.Tweet.likes_count - 1)
            )
            await session.execute(q)
            d = delete(models.Likes).where(
                models.Likes.who_id == who_id, models.Likes.tweet_id == tweet_id
            )
            await session.execute(d)
            await session.commit()
            logger_info.info(f"user {who_id} unliked tweet {tweet_id}")
            return {"result": True}
        else:
            logger_error.error(f"tweet {tweet_id} do not exist")
            return {"result": False}
    else:
        logger_error.error(
            f"user {who_id} has been already unliked tweet {tweet_id} or haven't like tweet"
        )
        return {"result": False}
