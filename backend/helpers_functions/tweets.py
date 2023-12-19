from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models_app import models
from init_logger import logger_info


async def get_info_user(id_user, tweet_id, session: AsyncSession):
    q = await session.execute(
        select(models.Likes)
        .options(selectinload(models.Likes.user_info))
        .where(models.Likes.who_id == id_user, models.Likes.id == tweet_id)
    )
    user = q.scalars().first()
    await session.close()
    logger_info.info(f"user info {id_user}")
    return user.user_info.to_json()


async def get_tweets(session: AsyncSession):
    q = await session.execute(
        select(models.Tweet)
        .options(selectinload(models.Tweet.user))
        .options(selectinload(models.Tweet.tweet))
        .order_by(models.Tweet.id.desc())
    )
    res = q.scalars().all()
    if res:
        all_tweets = []
        for tweet in res:
            to_dict = {}
            to_dict.update(tweet.to_json())
            to_dict.update(dict(author=tweet.user.to_json()))
            if tweet.tweet:
                to_dict.update(
                    dict(
                        likes=[
                            await get_info_user(user.who_id, user.id, session)
                            for user in tweet.tweet
                        ]
                    )
                )
            else:
                to_dict.update(dict(likes=[{"id": 0, "name": "Nobody"}]))
            all_tweets.append(to_dict)
        await session.close()
        logger_info.info("all tweets")
        return all_tweets
    else:
        logger_info.info("no tweets")
        return [
            {
                "id": 0,
                "content": "Nothing",
                "author": {"id": 0, "name": "Nobody"},
                "likes": [{"id": 0, "name": "Nobody"}],
            }
        ]
