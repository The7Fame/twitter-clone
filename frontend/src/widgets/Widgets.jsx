import React, {useContext, useEffect, useState} from "react";
import "../css/Widgets.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {Avatar, Button} from "@mui/material";
import {UserContext} from "../context/UserContext";
import { requestOption as follow } from "../profile/FollowAPI";
import { requestOption as infoUser } from "../profile/InfoAPI";
import { requestOption as infoUsers } from "./WidgetsAPI";
import axios from "axios";

const Widgets = () => {

    const [token] = useContext(UserContext);
    const [following, setFollowing] = useState(null);
    const [usersInfo, setUsersInfo] = useState(null);
    const [refreshIs, setRefreshIs] = useState(false);

    const getInfoUsers = async ()=>{
        const requestOptions = infoUsers(token);
        const response = await axios(requestOptions)
        if (response.status !==200){
            console.debug("wrong")
        }else{
            const data = await response.data;
            setUsersInfo(data)
        }
    }

    const getCurrUser = async () =>{
        const requestOptions = infoUser(token)
        const response = await axios(requestOptions)
        if (response.status !==200){
            console.debug("wrong")
        }else{
            const data = await response.data;
            setFollowing(data.user["following"]);
        }
    }

    const getFollow = async (userId) => {
        const requestOptions = follow(userId, token)
        const response = await axios(requestOptions);
        if(response.status !== 200){
            console.debug("wrong")
        }else{
            setRefreshIs(!refreshIs);
        }
    };

    const WidgetsUsers = ({following, users}) =>{
        const followings = following
        const allUsers = users
        const followingsUsers = []
        const toFollowingsUser = followings.map((following) => followingsUsers.push(following.id));
        return (
            <>
                {allUsers.map((user) => !followingsUsers.includes(user.id) && (
                   <li key={user.id} className="widgets__users-item">
                       <div className="widgets__users-container">
                            <Avatar
                              className="widgets__users-avatar"
                              src="https://upload.wikimedia.org/wikipedia/ru/c/cf/%D0%9B%D0%BE%D0%B1%D0%BE%D1%81_%D0%A3%D0%9F%D0%9D%D0%A4%D0%9C_%28%D0%BB%D0%BE%D0%B3%D0%BE%29.png"
                            />
                            <div className="widgets__users-info">
                                <a href={`/profile/${user.id}`}>
                                <h2 className="widgets__users-name">{user.name}</h2>
                                <span className="widgets__users-username">
                                @{user.name.replaceAll(" ", "").toLowerCase()}
                                </span>
                                </a>
                            </div>
                        </div>
                       <Button
                        variant="outlined"
                        className="widgets__users-btn"
                        onClick={() => getFollow(user.id)}
                        >
                        Подписаться
                        </Button>
                   </li>

            ),
            )}
            </>
            );
    }
    useEffect(()=>{
        getCurrUser();
        getInfoUsers();
        if (refreshIs) {
      window.location.reload();
    }
    },[token, refreshIs])

  return (

    <div className="widgets">
      <div className="widgets__input">
        <SearchRoundedIcon className="widgets__searchIcon" />
        <input type="text" placeholder="Поиск в Твиттере" />
      </div>
      <div className="widgets__trand">
        <div className="widget__trand-header">
          <h2>Тренды</h2>
        </div>
        <div className="widgets_trand-item">
          <h3>#GoLang</h3>
          <span>Твитов:155K</span>
        </div>
        <div className="widgets_trand-item">
          <h3>#Python</h3>
          <span>Твитов:121K</span>
        </div>
        <div className="widgets_trand-item-last">
          <h3>#DevConf2022</h3>
          <span>Твитов:90K</span>
        </div>
      </div>

        <div className="widgets__users">
                <div className="widget__users-header">
                  <h2>Возможно Вы знакомы</h2>
                </div>
               <ul className="widgets__users-items">
                   {following && (
                   <WidgetsUsers
                    following={following}
                    users={usersInfo}
                    />)}
               </ul>
        </div>

    </div>


  );
};

export default Widgets;
