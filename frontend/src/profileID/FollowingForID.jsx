import React, { useContext } from "react";
import "../css/Following.css";
import { Avatar } from "@mui/material";

const FollowingForID = ({ infoFollowing, currUserId }) => {
  const ShowFollowing = () => {
    const data = infoFollowing;
    const id = currUserId;
    const following = data.map((fol) =>
      fol.name !== "Nobody" ? (
        <li className="following__item">
          <div className="following__info">
            <Avatar
              className="following__avatar"
              src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png"
            />
            <div>
              <a href={fol.id === id ? `/profile/${fol.id}` : `/profile`}>
                <h2 className="following__name">{fol.name}</h2>
                <span className="following__username">
                  @{fol.name.replaceAll(" ", "").toLowerCase()}
                </span>
              </a>
            </div>
          </div>
        </li>
      ) : (
        <div className="following__no">
          <p>Никого не читает</p>
        </div>
      )
    );
    return following;
  };

  return (
    <>
      <ul className="following__items">
        <ShowFollowing />
      </ul>
    </>
  );
};

export default FollowingForID;
