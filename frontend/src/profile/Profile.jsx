import React from "react";
import { useState } from "react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useEffect } from "react";
import "../css/Profile.css";
import { Avatar } from "@mui/material";
import axios from "axios";
import Following from "./Following";
import Followers from "./Followers";
import { requestOption as infoUser } from "./InfoAPI";
import RefreshIcon from "@mui/icons-material/Refresh";

const Profile = () => {
  const [token] = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [openIsFollowing, setOpenIsFollowing] = useState(false);
  const [openIsFollower, setOpenIsFollower] = useState(false);

  const getUser = async () => {
    const requestOptions = infoUser(token);
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong");
    } else {
      const data = await response.data;
      setUserName(data.user["name"]);
    }
  };
  const handleFollowing = (e) => {
    e.preventDefault();
    setOpenIsFollowing(true);
    setOpenIsFollower(false);
  };

  const handleFollower = (e) => {
    e.preventDefault();
    setOpenIsFollower(true);
    setOpenIsFollowing(false);
  };
  useEffect(() => {
    getUser();
  }, [token]);

  return (
    <div className="profile">
      {/**Header */}
      <div className="profile__header">
        <h2>Профиль</h2>
          <a href="/profile">
            <RefreshIcon />
          </a>
      </div>

      {/**About user */}
      <div className="profile__user">
        <Avatar
          className="profile__avatar"
          src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png"
        />
        <h2>{userName}</h2>
        <span>@{userName.replaceAll(" ", "").toLowerCase()}</span>
      </div>
      <div className="profile__about">
        <div
          className={
            openIsFollowing ? "profile__btn-foll active" : "profile__btn-foll"
          }
        >
          <p onClick={handleFollowing}>Читаю</p>
        </div>
        <div
          className={
            openIsFollower ? "profile__btn-foll active" : "profile__btn-foll"
          }
        >
          <p onClick={handleFollower}>Читатели</p>
        </div>
      </div>
      <div>
        {openIsFollowing && <Following />}
        {openIsFollower && <Followers />}
      </div>
      <div className="profile__thanksMe">
        <h2>Спасибо, что Вы с нами!🤘🏻</h2>
      </div>
    </div>
  );
};

export default Profile;
