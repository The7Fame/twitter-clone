from fastapi import FastAPI
from app_routers import (
    router_medias,
    router_token,
    router_tweet,
    router_tweets,
    router_users,
)


def create_app():
    application = FastAPI()

    @application.get("/api")
    async def twitter_app_message():
        return {"message": "Welcome to Twitter App"}

    application.include_router(router=router_token.router)
    application.include_router(router=router_users.router)
    application.include_router(router=router_tweet.router)
    application.include_router(router=router_tweets.router)
    application.include_router(router=router_medias.router)
    return application


app = create_app()
