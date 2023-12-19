import React from "react";
import "../css/Feed.css";
import TweetBox from "../tweetbox/TweetBox";
import Post from "../post/Post";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import { requestOption } from "./UserIdAPI";
import { requestOption as requestTweets } from "./GetTweetsAPI";

const Feed = () => {
  const [token] = useContext(UserContext);
  const [loaded, setLoaded] = useState(false);
  const [tweets, setTweets] = useState(null);
  const [userId, setUserId] = useState(null);

  const getUserId = async () => {
    const requestOptions = requestOption(token);
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in Feed");
    } else {
      const data = await response.data;
      setUserId(data.user["id"]);
    }
  };

  const getTweets = async () => {
    const requestOptions = requestTweets(token);
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in Feed");
    } else {
      const data = await response.data;
      setTweets(data.tweets);
      setLoaded(true);
    }
  };

  const PostOut = ({ infoTweets }) => {
    const tweetsAll = infoTweets;
    const allPosts = tweetsAll.map((tweet) => (
      <Post
        key={tweet.id}
        attachments={tweet.attachments}
        idTweet={tweet.id}
        infoLikes={tweet.likes}
        idUserLiked={userId}
        idUser={tweet.author["id"]}
        content={tweet.content}
        username={tweet.author["name"]}
        tagname={tweet.author["name"]}
      />
    ));
    return allPosts;
  };
  useEffect(() => {
    getTweets();
    getUserId();
  }, [token]);

  return (
    <>
      <div className="feed">
        {/**Header */}
        <div className="feed__header">
          <h2>Главная</h2>{" "}
          <a href="/">
            <RefreshIcon />
          </a>
        </div>

        {/**TweetBox */}

        <TweetBox />

        {/**Post */}
        {loaded && tweets ? (
          <PostOut infoTweets={tweets} />
        ) : (
          <p className="feed__loading">Загрузка</p>
        )}
      </div>
    </>
  );
};

export default Feed;
