import React from "react";
import { useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useEffect } from "react";
import "../css/Profile.css";
import { Avatar } from "@mui/material";
import FollowersForID from "./FollowersForID";
import FollowingForID from "./FollowingForID";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";

const ProfileID = () => {
  const [token] = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [id, setId] = useState(null);
  const [openIsFollowing, setOpenIsFollowing] = useState(false);
  const [openIsFollower, setOpenIsFollower] = useState(false);
  const [followingInfo, setFollowingInfo] = useState(null);
  const [followerInfo, setFollowerInfo] = useState(null);
  const [curUserIdLogIn, setCurUserIdLogIn] = useState(null);
  const params = useParams();

  const getUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/users/${params.idUser}`, requestOptions);
    if (!response.ok) {
      console.debug("wrong in ProfileID");
    } else {
      const data = await response.json();
      setFollowerInfo(data.user["followers"]);
      setFollowingInfo(data.user["following"]);
      setUserName(data.user["name"]);
      setId(params.idUser);
    }
  };
  const getСurrUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch(`/api/users/me`, requestOptions);
    if (!response.ok) {
      console.debug("wrong in ProfileID");
    } else {
      const data = await response.json();
      setCurUserIdLogIn(data.user["id"]);
    }
  };
  const handleFollowing = async (e) => {
    e.preventDefault();
    setOpenIsFollowing(true);
    setOpenIsFollower(false);
  };

  const handleFollower = async (e) => {
    e.preventDefault();
    setOpenIsFollower(true);
    setOpenIsFollowing(false);
  };

  const getFollowingUsers = async (userId) => {
    const requestOptions = {
      method: "DELETE",
      url: `/api/users/${userId}/follow`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in ProfileID");
    } else {
      getUser();
    }
  };

  const getFollowersUsers = async (userId) => {
    const requestOptions = {
      method: "POST",
      url: `/api/users/${userId}/follow`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        whom_user: userId,
      }),
    };

    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in ProfileID");
    } else {
      getUser();
    }
  };

  const WhichButtonWillBe = ({ idProfile, idUserCurr, info }) => {
    const id = parseInt(idProfile);
    const followersAll = [];
    const idCurr = idUserCurr;
    const followers = info;
    const toFollowers = followers.map((follower) =>
      followersAll.push(follower.id)
    );
    const button = (
      <>
        {idCurr !== id && (
          <div>
            {followersAll.includes(idCurr) ? (
              <Button
                variant="outlined"
                className="following__btn"
                onClick={() => getFollowingUsers(id)}
              >
                Отписаться
              </Button>
            ) : (
              <Button
                variant="outlined"
                className="following__btn"
                onClick={() => getFollowersUsers(id)}
              >
                Подписаться
              </Button>
            )}
          </div>
        )}
      </>
    );
    return button;
  };

  useEffect(() => {
    getUser();
    getСurrUser();
  }, [token, params]);

  return (
    <div className="profile">
      {/**Header */}
      <div className="profile__header">
        <h2>Профиль</h2>
        <a href={`/profile/${id}`}>
            <RefreshIcon />
          </a>
      </div>

      {/**About user */}
      <div className="profile__user-id">
        <div>
          <Avatar
            className="profile__avatar"
            src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png"
          />
          <h2>{userName}</h2>
          <span>@{userName.replaceAll(" ", "").toLowerCase()}</span>
        </div>
        {!followerInfo ? (
          <p>загрузка</p>
        ) : (
          <WhichButtonWillBe
            idProfile={id}
            idUserCurr={curUserIdLogIn}
            info={followerInfo}
          />
        )}
      </div>
      <div className="profile__about">
        <div
          className={
            openIsFollowing ? "profile__btn-foll active" : "profile__btn-foll"
          }
        >
          <p onClick={handleFollowing}>Читает</p>
        </div>
        <div
          className={
            openIsFollower ? "profile__btn-foll active" : "profile__btn-foll"
          }
        >
          <p onClick={handleFollower}>Читают</p>
        </div>
      </div>

      <div>
        {openIsFollowing && <FollowingForID infoFollowing={followingInfo} />}
        {openIsFollower && <FollowersForID infoFollowers={followerInfo} />}
      </div>
      <div className="profile__thanksMe">
        <h2>Спасибо, что Вы с нами!🤘🏻</h2>
      </div>
    </div>
  );
};

export default ProfileID;
