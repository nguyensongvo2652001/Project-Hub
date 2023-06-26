import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NoAuthComponent = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      await authContext.checkIfUserIsLoggedIn();
      setIsLoading(false);
    };

    if (authContext.isLoggedIn === false) {
      setIsLoading(false);
    } else if (authContext.isLoggedIn === true) {
      authContext.logOut();
    } else {
      checkLoginStatus();
    }
  }, [authContext, navigate]);

  return (
    <>
      {isLoading && <p>IS LOADING</p>}
      {!isLoading && !authContext.isLoggedIn && props.children}
    </>
  );
};

export default NoAuthComponent;
