import React from "react";
import "../css/Followers.css";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { requestOption as infoUser } from "./InfoAPI";
import { requestOption as unFollow } from "./UnFollowAPI";
import { requestOption as follow } from "./FollowAPI";

const Followers = () => {
  const [token] = useContext(UserContext);
  const [following, setFollowing] = useState(null);
  const [followers, setFollowers] = useState(null);

  const getUserInfoAboutFollowingAndFollowers = async () => {
    const requestOptions = infoUser(token);
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in Followers");
    } else {
      const data = await response.data;
      setFollowers(data.user.followers);
      setFollowing(data.user.following);
    }
  };

  const getFollowingUsers = async (userId) => {
    const requestOptions = unFollow(userId, token);
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in Followers");
    } else {
      getUserInfoAboutFollowingAndFollowers();
    }
  };

  const getFollowersUsers = async (userId) => {
    const requestOptions = follow(userId, token);
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in Followers");
    } else {
      getUserInfoAboutFollowingAndFollowers();
    }
  };

  const ShowFollowers = ({
    dataAboutUserFollowers,
    dataAboutUserFollowings,
  }) => {
    const data = dataAboutUserFollowers;
    const data2 = dataAboutUserFollowings;
    const followings = [];
    const to_followings = data2.map((f) => followings.push(f.id));
    const following = data.map((fol) =>
      fol.name !== "Nobody" ? (
        <li className="following__item">
          <div className="following__info">
            <Avatar
              className="following__avatar"
              src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png"
            />
            <div>
              <a href={`/profile/${fol.id}`}>
                <h2 className="following__name">{fol.name}</h2>
                <span className="following__username">
                  @{fol.name.replaceAll(" ", "").toLowerCase()}
                </span>
              </a>
            </div>
          </div>
          {!followings.includes(fol.id) ? (
            <Button
              variant="outlined"
              className="following__btn"
              onClick={() => getFollowersUsers(fol.id)}
            >
              Подписаться
            </Button>
          ) : (
            <Button
              variant="outlined"
              className="following__btn"
              onClick={() => getFollowingUsers(fol.id)}
            >
              Отписаться
            </Button>
          )}
        </li>
      ) : (
        <div className="follower__no">
          <p>Никто Вас не читает</p>
        </div>
      )
    );
    return following;
  };

  useEffect(() => {
    getUserInfoAboutFollowingAndFollowers();
  }, [token]);

  return (
    <>
      {followers && (
        <ul className="follower__items">
          <ShowFollowers
            dataAboutUserFollowers={followers}
            dataAboutUserFollowings={following}
          />
        </ul>
      )}
    </>
  );
};

export default Followers;
