import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../css/Header.css";
import { Button } from "@mui/material";

const Header = ({ title }) => {
  const [token, setToken] = useContext(UserContext);
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="logout">
      {!token ? (
        <h1 className="logout__header">{title}</h1>
      ) : (
        <Button
          className="logout_btn"
          onClick={handleLogout}
          variant="outlined"
        >
          Выйти
        </Button>
      )}
    </div>
  );
};

export default Header;
