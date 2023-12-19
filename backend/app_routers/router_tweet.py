from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from helpers_functions import likes, tweet, user
from schemas_app import schemas

router = APIRouter(prefix="/api/tweet")


@router.delete("/{id_tweet}", response_model=schemas.TweetDelete)
async def delete_tweet(
    id_tweet: int,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    return await tweet.delete_tweet(id_tweet, access_user.id, session)


@router.post("/{id_tweet}/likes", response_model=schemas.LikeSuccess)
async def like_tweet(
    id_tweet: int,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    return await likes.update_likes_positive(
        tweet_id=id_tweet, who_id=access_user.id, session=session
    )


@router.delete("/{id_tweet}/likes", response_model=schemas.LikeDelete)
async def like_tweet_delete(
    id_tweet: int,
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    return await likes.update_likes_negative(
        who_id=access_user.id, tweet_id=id_tweet, session=session
    )
