import asyncio

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from db.database import Base, get_session
from main import create_app
from models_app.models import Tweet, User

# engine_test = create_async_engine("postgresql+asyncpg://test:test@localhost:5433")
engine_test = create_async_engine("postgresql+asyncpg://test:test@postgres-test/test")
async_session = sessionmaker(engine_test, class_=AsyncSession, expire_on_commit=False)


async def init_db_test():
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        async with session.begin():
            session.add_all(
                [
                    User(
                        name="John Doe",
                        username="johndoe",
                        pass_hash="$2b$12$Ddj84v2HLXF/6kvv/ymXTeMQkhOphNliSGyI35m1ypwS83oy6XzVC",
                    ),
                    User(
                        name="John Wick",
                        username="johnwick",
                        pass_hash="$2b$12$Ddj84v2HLXF/6kvv/ymXTeMQkhOphNliSGyI35m1ypwS83oy6XzVC",
                    ),
                    User(
                        name="John Snow",
                        username="johnsnow",
                        pass_hash="$2b$12$Ddj84v2HLXF/6kvv/ymXTeMQkhOphNliSGyI35m1ypwS83oy6XzVC",
                    ),
                    Tweet(tweet_data="tweet1", user_id=1),
                    Tweet(tweet_data="tweet1", user_id=3),
                ]
            )
            await session.commit()


async def get_session_override():
    async with async_session() as session:
        yield session
        await session.commit()


@pytest.fixture(scope="session")
async def test_app_with_db():
    await init_db_test()


@pytest.fixture(scope="module")
async def client():
    app = create_app()
    app.dependency_overrides[get_session] = get_session_override
    async with AsyncClient(app=app, base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_api(client):
    r = await client.get("/api")
    assert r.status_code == 200


@pytest.fixture(scope="session")
def event_loop(request):
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.mark.asyncio
async def get_headers(client):
    login_data = {
        "username": "johnsnow",
        "password": "secret",
    }
    r = await client.post("/api/token", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers


@pytest.mark.asyncio
@pytest.fixture(scope="module")
async def headers(client):
    return await get_headers(client)
