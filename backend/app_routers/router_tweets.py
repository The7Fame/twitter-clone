from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from helpers_functions import tweet, tweets, user
from schemas_app import schemas

router = APIRouter(prefix="/api/tweets")


@router.post("", response_model=schemas.TweetSuccess)
async def tweet_success(
    schema: schemas.TweetIn,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    if 0 in schema.tweet_media_ids:
        schema.tweet_media_ids = []
    created_tweet = await tweet.create_tweet(
        who_id=access_user.id, data=schema, session=session
    )
    return {"result": True, "tweet_id": created_tweet.id}


@router.get("", response_model=schemas.TweetFeedOut)
async def feed_tweets(
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    tweets_all = await tweets.get_tweets(session)
    return {"result": True, "tweets": tweets_all}
