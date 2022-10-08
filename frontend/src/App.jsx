import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import "./App.css";
import Login from "./login/Login";
import { UserContext } from "./context/UserContext";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Feed from "./feed/Feed";
import Widgets from "./widgets/Widgets";
import Profile from "./profile/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfileID from "./profileID/ProfileID";
import axios from "axios";

const App = () => {
  const [message, setMessage] = useState("");
  const [token] = useContext(UserContext);
  const getText = async () => {
    const requestOptions = {
      method: "GET",
      url: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios(requestOptions);
    const data = await response.data;
    if (response.status !== 200) {
      console.debug(response);
    } else {
      setMessage(data["message"]);
    }
  };

  useEffect(() => {
    getText();
  }, []);
  return (
    <>
      <Header title={message} />
      <div className="text__login">
        {!token ? (
          <div>
            <Login />
          </div>
        ) : (
          <div className="app">
            <BrowserRouter>
              <Sidebar />
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:idUser" element={<ProfileID />} />
              </Routes>
            </BrowserRouter>
            <Widgets />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
