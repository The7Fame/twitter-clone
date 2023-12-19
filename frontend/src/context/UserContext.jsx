import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { requestOption } from "./UserAPI";
export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("mytokehere"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = requestOption(token);
      const response = await fetch("/api/users/me", requestOptions);
      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("mytokehere", token);
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
