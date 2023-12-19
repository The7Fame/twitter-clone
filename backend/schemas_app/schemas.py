from typing import List, Optional, Union

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Union[str, None] = None


class SuccessBase(BaseModel):
    result: bool


class DeleteBase(BaseModel):
    result: bool


class TweetIn(BaseModel):
    tweet_data: str
    tweet_media_ids: Optional[List[int]] = None


class TweetOut(TweetIn):
    id: int
    user_id: int
    likes_count: int

    class Config:
        orm_mode = True


class LoadImage(SuccessBase):
    media_id: int


class TweetSuccess(SuccessBase):
    tweet_id: int


class TweetDelete(DeleteBase):
    ...


class LikeSuccess(SuccessBase):
    ...


class LikeDelete(DeleteBase):
    ...


class FollowUser(SuccessBase):
    ...


class UnSubscribeUser(DeleteBase):
    ...


class FollowerBase(BaseModel):
    id: int
    name: str

    class Confing:
        orm_mode = True


class HashPassword(FollowerBase):
    username: str
    pass_hash: str


class UserBase(FollowerBase):
    followers: List[FollowerBase]
    following: List[FollowerBase]


class UserInfo(SuccessBase):
    user: Union[UserBase]


class TweetFeedBase(BaseModel):
    id: int
    content: str
    attachments: Optional[List[int]] = None
    author: Union[FollowerBase]
    likes: List[Union[FollowerBase]]


class TweetFeedOut(SuccessBase):
    tweets: List[Union[TweetFeedBase]]


class User(BaseModel):
    username: str
    name: Union[str, None] = None


class UserOut(User):
    id: int

    class Config:
        orm_mode = True


class CreateFile(BaseModel):
    name: str


class File(CreateFile):
    id: int

    class Config:
        orm_mode = True
