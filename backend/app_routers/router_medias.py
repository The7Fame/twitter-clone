from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_session
from helpers_functions import medias, user
from schemas_app import schemas

router = APIRouter(prefix="/api/medias")


@router.post("", response_model=schemas.LoadImage)
async def load_medias(
    form: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
    access_user: schemas.UserOut = Depends(user.get_current_user),
):
    add_file = await medias.add_file(form.filename, session)

    save_file = await medias.write_file_to_disk(
        form.file.read(), add_file.id, add_file.id
    )
    return {"result": True, "media_id": add_file.id}
