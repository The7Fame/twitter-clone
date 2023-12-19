import React from "react";
import SidebarOption from "./SidebarOption";
import "../css/Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import TwitterIcon from "@mui/icons-material/Twitter";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Button } from "@mui/material";
import { useState } from "react";
import Modal from "../modal/Modal";

const Sidebar = () => {
  const [activeModalIs, setActiveModalIs] = useState(false);

  return (
    <>
      <div className="sidebar">
        <TwitterIcon className="sidebar__twitterIcon" />
        <a href="/">
          <SidebarOption active Icon={HomeIcon} text="Главная" />
        </a>
        <a>
          <SidebarOption Icon={SearchIcon} text="Обзор" />
        </a>
        <a>
          <SidebarOption Icon={NotificationsNoneIcon} text="Уведомления" />
        </a>
        <a>
          <SidebarOption Icon={MailOutlineIcon} text="Сообщения" />
        </a>
        <a>
          <SidebarOption Icon={BookmarkBorderIcon} text="Закладки" />
        </a>
        <a>
          <SidebarOption Icon={ListAltIcon} text="Списки" />
        </a>
        <a href="/profile">
          <SidebarOption Icon={PermIdentityIcon} text="Профиль" />
        </a>
        <a>
          <SidebarOption Icon={MoreHorizIcon} text="Ещё" />
        </a>
        <Button
          variant="outlined"
          className="sidebar__tweet"
          fullWidth
          onClick={() => setActiveModalIs(true)}
        >
          Твитнуть
        </Button>
      </div>
      <Modal active={activeModalIs} setActive={setActiveModalIs} />
    </>
  );
};

export default Sidebar;
