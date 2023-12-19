import React from "react";
import "../css/Post.css";
import { Avatar, Button, imageListClasses } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PublishIcon from "@mui/icons-material/Publish";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import { useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { requestOption as likeIn } from "./LikeInAPI";
import { requestOption as likeOut } from "./LikeOutAPI";
import { requestOption as deleteTweet } from "./DeleteTweetAPI";
const Post = ({
  attachments,
  username,
  tagname,
  content,
  idUserLiked,
  infoLikes,
  idTweet,
  idUser,
}) => {
  const [token] = useContext(UserContext);
  const [openThreeDotsIs, setOpenThreeDotsIs] = useState(false);
  const [refreshIs, setRefreshIs] = useState(false);
  const LikeIn = async (tweetId) => {
    const requestOptions = likeIn(token, tweetId);
    const response = await fetch(`/api/tweet/${tweetId}/likes`, requestOptions);
    if (!response.ok) {
      console.debug("wrong in Post");
    } else {
      setRefreshIs(!refreshIs);
    }
  };

  const LikeOut = async (tweetId) => {
    const requestOptions = likeOut(token, tweetId);
    const response = await fetch(`/api/tweet/${tweetId}/likes`, requestOptions);
    if (!response.ok) {
      console.debug("wrong in Post");
    } else {
      setRefreshIs(!refreshIs);
    }
  };

  const ButtonLikeWhichWillBe = ({ likes, idUser, tweetId }) => {
    const id = idUser;
    const tweetIdi = tweetId;
    const likes_all = [];
    const to_like = likes.map((like) => likes_all.push(like.id));
    const button = (
      <div className="post__likes">
        {!likes_all.includes(id) ? (
          <FavoriteBorderRoundedIcon
            className="post__icons"
            onClick={() => LikeIn(tweetIdi)}
          />
        ) : (
          <FavoriteIcon
            className="post__icons"
            onClick={() => LikeOut(tweetIdi)}
          />
        )}
        <span> {!likes_all.includes(0) ? likes_all.length : 0}</span>
      </div>
    );

    return button;
  };

  const handleDelete = async (tweetId) => {
    const requestOptions = deleteTweet(token);
    const response = await fetch(`/api/tweet/${tweetId}`, requestOptions);
    if (!response.ok) {
      console.debug("wrong in Post");
    } else {
      setOpenThreeDotsIs(false);
      setRefreshIs(!refreshIs);
    }
  };

  const SetPictureOrNot = ({ infoAboutImg }) => {
    const data = infoAboutImg;
    const img =
      !data.includes(0) &&
      data.map((imgId) => (
        <div key={imgId} className="post__media">
          <img src={`./media/${imgId}/${imgId}.jpg`} alt="картинка" />
        </div>
      ));
    return img;
  };
  useEffect(() => {
    if (refreshIs) {
      window.location.reload();
    }
  }, [refreshIs]);
  return (
    <>
      {username !== "Nobody" ? (
        <div className="post">
          <div className="post__avatar">
            <Avatar src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png?20171124231856" />
          </div>
          <div className="post__body">
            <div className="post__header">
              <div className="post__top">
                <div className="post__header-text">
                  <a
                    href={
                      idUser !== idUserLiked ? `/profile/${idUser}` : `/profile`
                    }
                  >
                    <h3>
                      {username}
                      <span className="post__username">
                        @{tagname.replaceAll(" ", "").toLowerCase()}
                      </span>
                    </h3>
                  </a>
                </div>
                <div className="post__menu">
                  {openThreeDotsIs && (
                    <div className="post__menu-delete">
                      {idUser === idUserLiked && (
                        <Button
                          className="post__menu-delete-btn"
                          onClick={() => handleDelete(idTweet)}
                        >
                          Удалить
                        </Button>
                      )}
                    </div>
                  )}
                  <MoreHorizIcon
                    className={
                      idUser === idUserLiked
                        ? "post__top-btn"
                        : "post__top-btn-rej"
                    }
                    onClick={() => setOpenThreeDotsIs(!openThreeDotsIs)}
                  />
                </div>
              </div>
              <div className="post__header-desc">
                <p>{content}</p>
              </div>
            </div>
            <SetPictureOrNot infoAboutImg={attachments} />
            <div className="post__footer">
              <ChatBubbleOutlineRoundedIcon
                className="post__icons"
                fontSize="small"
              />
              <RepeatIcon className="post__icons" fontSize="small" />
              <lable>
                <ButtonLikeWhichWillBe
                  idUser={idUserLiked}
                  likes={infoLikes}
                  tweetId={idTweet}
                />
              </lable>
              <PublishIcon className="post__icons" fontSize="small" />
            </div>
          </div>
        </div>
      ) : (
        <div className="post__no">
          <p>нет постов</p>
        </div>
      )}
    </>
  );
};

export default Post;
