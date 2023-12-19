import React, { useContext } from "react";
import "../css/Following.css";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import { UserContext } from "../context/UserContext";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Following = () => {
  const [token] = useContext(UserContext);
  const [following, setFollowing] = useState(null);

  const getUserInfoAboutFollowingAndFollowers = async () => {
    const requestOptions = {
      method: "GET",
      url: "/api/users/me",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await axios(requestOptions);
    if (response.status !== 200) {
      console.debug("wrong in Following");
    } else {
      const data = await response.data;
      setFollowing(data.user.following);
    }
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
      console.debug("wrong in Following");
    } else {
      getUserInfoAboutFollowingAndFollowers();
    }
  };

  const ShowFollowing = ({ dataAboutUser }) => {
    const data = dataAboutUser;
    const following = data.map((fol) =>
      fol.name !== "Nobody" ? (
        <li className="following__item">
          <div className="following__info">
            <Avatar
              className="following__avatar"
              src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png"
            />
            <div>
              <a href={`profile/${fol.id}`}>
                <h2 className="following__name">{fol.name}</h2>
                <span className="following__username">
                  @{fol.name.replaceAll(" ", "").toLowerCase()}
                </span>
              </a>
            </div>
          </div>
          <Button
            variant="outlined"
            className="following__btn"
            onClick={() => getFollowingUsers(fol.id)}
          >
            Отписаться
          </Button>
        </li>
      ) : (
        <div className="following__no">
          <p>Не подписаны ни на кого</p>
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
      {following && (
        <ul className="following__items">
          <ShowFollowing dataAboutUser={following} />
        </ul>
      )}
    </>
  );
};

export default Following;
