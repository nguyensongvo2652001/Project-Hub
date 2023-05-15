import React, { useState } from "react";
import Cookies from "js-cookie";

const AuthContext = React.createContext({
  isLoggedIn: undefined,
  checkIfUserIsLoggedIn: async () => {},
  logOut: () => {},
});

export const AuthContextProvider = function (props) {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  const checkIfUserIsLoggedIn = async () => {
    try {
      const validateTokenRoute = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/validateToken`;

      const response = await fetch(validateTokenRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseBody = await response.json();
      const { tokenIsValid } = responseBody.data;
      setIsLoggedIn(tokenIsValid);
    } catch (err) {
      console.log(err);
      setIsLoggedIn(false);
    }
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkIfUserIsLoggedIn, logOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
