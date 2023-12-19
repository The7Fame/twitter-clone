import React from "react";
import "../css/TweetBox.css";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import WallpaperRoundedIcon from "@mui/icons-material/WallpaperRounded";
import GifRoundedIcon from "@mui/icons-material/GifRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import { useEffect } from "react";

const TweetBox = () => {
  const [content, setContent] = useState("");
  const [mediadIds, setMediaIds] = useState(null);
  const [token] = useContext(UserContext);
  const [image, setImage] = useState("");
  const [refreshIs, setRefreshIs] = useState(false);

  const FormTweet = () => {
    setContent("");
  };

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        tweet_data: content,
        tweet_media_ids: !mediadIds ? [0] : [mediadIds],
      }),
    };

    const response = await fetch("/api/tweets", requestOptions);
    if (!response.ok) {
      console.debug("wrong in TweetBox");
    } else {
      FormTweet();
      setRefreshIs(!refreshIs);
    }
  };

  const handleSetMedia = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("form", image);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    };
    const response = await fetch("/api/medias", requestOptions);
    if (!response.ok) {
      console.debug("wrong in TweetBox");
    } else {
      const data = await response.json();
      setImage("");
      setMediaIds(data["media_id"]);
    }
  };

  const handleFile = async (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    console.log("here");
    if (refreshIs) {
      window.location.reload();
    }
  }, [refreshIs]);
  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png" />
          <input
              onKeyDown={(e)=>{e.key ==="Enter" && handleCreateTweet(e)}}
            type="text"
            placeholder="Что происходит?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="tweetBox__footer">
          <div className="tweetBox__footer-left">
            <ul className="tweetBox__footer-list">
              <li className="tweetBox__footer-item">
                <form>
                  <label
                    className={
                      !image
                        ? "tweetBox__imageUpload"
                        : "tweetBox__imageUpload-dis"
                    }
                  >
                    <WallpaperRoundedIcon />
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFile(e)}
                    />
                  </label>
                </form>
              </li>
              <li className="tweetBox__footer-item">
                <GifRoundedIcon />
              </li>
              <li className="tweetBox__footer-item">
                <MenuRoundedIcon />
              </li>
              <li className="tweetBox__footer-item">
                <SentimentSatisfiedAltRoundedIcon />
              </li>
            </ul>
          </div>
          {image && (
            <div className="tweetBox__btn">
              <Button
                className="tweetBox__btn-upload"
                type="submit"
                onClick={handleSetMedia}
              >
                загрузить
              </Button>
              <Button
                className="tweetBox__btn-reset"
                type="reset"
                onClick={() => setImage("")}
              >
                отменить
              </Button>
            </div>
          )}
          <div className="tweetBox__footer-right">
            <Button
              className={
                content || mediadIds
                  ? "tweetBox__tweet-btn"
                  : "tweetBox__tweet-btn-notactive"
              }
              onClick={handleCreateTweet}
            >
              Твитнуть
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TweetBox;
