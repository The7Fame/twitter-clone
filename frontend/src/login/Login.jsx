import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "../error/ErrorMessage";
import "../css/Login.css";
import InputRoundedIcon from "@mui/icons-material/InputRounded";
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded";
import { Button } from "@mui/material";
import { requestOption } from "./LoginAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const submitLogin = async () => {
    const requestOptions = requestOption(email, password);
    const response = await fetch("/api/token", requestOptions);
    const data = await response.json();
    if (!response.ok) {
      console.debug("wrong in Login");
      setErrorMessage(data.detail);
    } else {
      setToken(data.access_token);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="logIn">
      <form className="box" onSubmit={handleSubmit}>
        <div className="field">
          <InputRoundedIcon />
          <div className="control">
            <input
              type="text"
              placeholder="Введите логин"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>
        <div className="field">
          <PasswordRoundedIcon />
          <div className="control">
            <input
                onKeyDown={(e)=>{e.key === "Enter" && handleSubmit(e)}}
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        <ErrorMessage message={errorMessage} />
        <br />
        <Button variant="outlined" className="login__btn" type="submit">
          Войти
        </Button>
      </form>
    </div>
  );
};

export default Login;
