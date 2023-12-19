import React from "react";
import TweetBox from "../tweetbox/TweetBox";
import "../css/Modal.css";

const Modal = ({ active, setActive }) => {
  return (
    <>
      <div
        className={active ? "modal active" : "modal"}
        onClick={() => setActive(false)}
      >
        <div className="modal__box" onClick={(e) => e.stopPropagation()}>
          <TweetBox />
        </div>
      </div>
    </>
  );
};

export default Modal;
