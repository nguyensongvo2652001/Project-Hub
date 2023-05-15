import React, { useState } from "react";
import Cookies from "js-cookie";
import useSendRequest from "../hooks/useSendRequest";

const AuthContext = React.createContext({
  isLoggedIn: undefined,
  checkIfUserIsLoggedIn: async () => {},
  logIn: () => {},
  logOut: () => {},
});

export const AuthContextProvider = function (props) {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  const validateTokenURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/validateToken`;
  const { sendRequest } = useSendRequest();

  const checkIfUserIsLoggedIn = async () => {
    try {
      const responseBody = await sendRequest(validateTokenURL, {
        method: "POST",
      });
      const { tokenIsValid } = responseBody.data;
      setIsLoggedIn(tokenIsValid);
    } catch (err) {
      console.log(err);
      setIsLoggedIn(false);
    }
  };

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, checkIfUserIsLoggedIn, logOut, logIn }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
