from sqlalchemy import ARRAY, Column, ForeignKey, Integer, Text
from sqlalchemy.orm import backref, relationship

from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(Text)
    name = Column(Text)
    pass_hash = Column(Text)

    def to_json(self):
        return {"id": self.id, "name": self.name}


class Follower(Base):
    __tablename__ = "followers"

    id = Column(Integer, primary_key=True)
    who_id = Column(Integer, ForeignKey("users.id"))
    whom_id = Column(Integer, ForeignKey("users.id"))
    user_info_whom = relationship("User", backref="followers", foreign_keys=whom_id)
    user_info_who = relationship("User", backref="user_info_who", foreign_keys=who_id)


class Tweet(Base):
    __tablename__ = "tweets"

    id = Column(Integer, primary_key=True)
    tweet_data = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", backref=backref("tweets", cascade="all, delete"))
    tweet_media_ids = Column(ARRAY(Integer), default=None)
    likes_count = Column(Integer, default=0)
    tweet = relationship(
        "Likes", backref=backref("tweets", cascade="all, delete", passive_deletes=True)
    )

    def to_json(self):
        return {
            "id": self.id,
            "content": self.tweet_data,
            "attachments": self.tweet_media_ids,
        }


class Files(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True)
    name = Column(Text)


class Likes(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True)
    tweet_id = Column(Integer, ForeignKey("tweets.id", ondelete="CASCADE"))
    who_id = Column(Integer, ForeignKey("users.id"))
    like = relationship(
        "Tweet", backref=backref("likes", cascade="all, delete", passive_deletes=True)
    )
    user_info = relationship("User", backref="likes")
