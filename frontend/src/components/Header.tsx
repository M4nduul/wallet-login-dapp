import React, { useState, useEffect, useMemo } from "react";
import { Login } from "./Login";
import { Profile } from "./Profile";
import { Auth } from "../types";
import "./Component.css";

export const Header: React.FC = () => {
  const [auth, setAuth] = useState<Auth>();

  useEffect(() => {
    // Access token is stored in localstorage
    const ls = window.localStorage.getItem("auth-key");
    setAuth(ls && JSON.parse(ls));
  }, []);

  const handleLoggedIn = (auth: Auth) => {
    localStorage.setItem("auth-key", JSON.stringify(auth));
    setAuth(auth);
  };

  const handleLoggedOut = () => {
    localStorage.removeItem("auth-key");
    setAuth(undefined);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#000",
        boxShadow: "black 0px 0px 20px 15px",
        padding: " 6px 24px",
      }}
    >
      <h2>CYAN</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
            {/* <p>Docs</p>
            <p>Team</p>
            <p>Twitter</p>
            <p>Discord</p>
            <p>YouTube</p>
            <p>Articles</p> */}
        <div>
          {auth ? (
            <Profile auth={auth} onLoggedOut={handleLoggedOut} />
          ) : (
            <Login onLoggedIn={handleLoggedIn} />
          )}
          <button>
            <span>Launch App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
