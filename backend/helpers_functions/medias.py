import os
import aiofiles
from sqlalchemy.ext.asyncio import AsyncSession
from models_app import models
from schemas_app import schemas
from init_logger import logger_info


async def add_file(name: str, session: AsyncSession):
    file = models.Files(name=name)
    session.add(file)
    await session.commit()
    await session.close()
    logger_info.info(f"added file {name}")
    return schemas.File.from_orm(file)


async def write_file_to_disk(content: bytes, name: str, PATH):
    directory = str(PATH)
    path = os.path.join("media", directory)
    os.mkdir(path)
    file_path = "media/{}/{}.jpg".format(directory, name)
    async with aiofiles.open(file_path, mode="wb") as file:
        await file.write(content)
