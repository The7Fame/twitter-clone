from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models_app import models
from schemas_app import schemas
from init_logger import logger_info, logger_error


async def exist_pair_tweet_owner(tweet_id: int, who_id: int, session: AsyncSession):
    q = await session.execute(
        select(models.Tweet).where(
            models.Tweet.id == tweet_id, models.Tweet.user_id == who_id
        )
    )
    res = q.scalars().first()
    await session.close()
    return res


async def get_user_by_like_on_tweet(tweet_id, session: AsyncSession):
    q = await session.execute(
        select(models.Likes.who_id).where(models.Likes.tweet_id == tweet_id)
    )
    res = q.scalars().first()
    name_user = await session.execute(select(models.User).where(models.User.id == res))
    return name_user.scalars().first()


async def create_tweet(who_id, data: schemas.TweetIn, session: AsyncSession):
    tweet_model = models.Tweet(
        tweet_data=data.tweet_data, tweet_media_ids=data.tweet_media_ids, user_id=who_id
    )
    session.add(tweet_model)
    await session.commit()
    await session.close()
    logger_info.info(f"user {who_id} created tweet")
    return schemas.TweetOut.from_orm(tweet_model)


async def delete_tweet(tweet_id: int, who_id: int, session: AsyncSession):
    success_or_not = await exist_pair_tweet_owner(tweet_id, who_id, session)
    if success_or_not:
        q = delete(models.Tweet).where(
            models.Tweet.id == tweet_id, models.Tweet.user_id == who_id
        )
        await session.execute(q)
        await session.commit()
        logger_info.info(f"user {who_id} has been deleted own tweet {tweet_id}")
        return {"result": True}
    else:
        logger_error.error(f"user {who_id} try delete not his tweet {tweet_id}")
        return {"result": False}
