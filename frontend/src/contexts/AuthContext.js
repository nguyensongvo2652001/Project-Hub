import React, { useState } from "react";
import Cookies from "js-cookie";
import useSendRequest from "../hooks/useSendRequest";
import useErrorHandling from "../hooks/useErrorHandling";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
  isLoggedIn: undefined,
  currentUser: {},
  checkIfUserIsLoggedIn: async () => {},
  getUserInfo: async () => {},
  logIn: () => {},
  logOut: async () => {},
});

export const AuthContextProvider = function (props) {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [currentUser, setCurrentUser] = useState({});

  const validateTokenURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/validateToken`;
  const getCurrentUserInfoURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/me`;
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const responseBody = await sendRequest(getCurrentUserInfoURL);
    const { user } = responseBody.data;
    setCurrentUser(user);
    return user;
  };

  const checkIfUserIsLoggedIn = async () => {
    try {
      const responseBody = await sendRequest(validateTokenURL, {
        method: "POST",
      });
      const { tokenIsValid } = responseBody.data;

      if (tokenIsValid) {
        await getUserInfo();
      }

      setIsLoggedIn(tokenIsValid);
    } catch (err) {
      handleError(err);
      setIsLoggedIn(false);
    }
  };

  const logIn = async () => {
    await checkIfUserIsLoggedIn();
    setIsLoggedIn(true);
    navigate("/projects");
  };

  const logOut = async () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    const logoutUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`;
    try {
      await sendRequest(logoutUrl);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        checkIfUserIsLoggedIn,
        logOut,
        logIn,
        currentUser,
        getUserInfo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
