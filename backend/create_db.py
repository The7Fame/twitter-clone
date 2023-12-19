import asyncio
import os
import psycopg2
from dotenv import load_dotenv
from db.database import engine, Base, async_session
from models_app.models import User

load_dotenv()
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_USER = os.getenv("POSTGRES_USER")


async def init_database():
    async with engine.begin() as conn:
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
                ]
            )
            await session.commit()


def main():
    asyncio.run(init_database())


if __name__ == "__main__":
    conn = psycopg2.connect(
        f"dbname={POSTGRES_USER} user={POSTGRES_USER} host=postgres password={POSTGRES_PASSWORD}"
    )
    cur = conn.cursor()
    cur.execute(
        "select exists(select * from information_schema.tables where table_name=%s)",
        ("users",),
    )
    if not cur.fetchone()[0]:
        main()
