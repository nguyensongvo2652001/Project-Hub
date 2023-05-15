import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NoAuthComponent = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      await authContext.checkIfUserIsLoggedIn();
      setIsLoading(false);
    };

    if (authContext.isLoggedIn === false) {
      setIsLoading(false);
    } else if (authContext.isLoggedIn === true) {
      navigate("/projects");
    } else {
      checkLoginStatus();
    }
  }, [authContext, navigate]);

  if (isLoading) {
    return <p>IS LOADING</p>;
  }

  return <>{props.children}</>;
};

export default NoAuthComponent;
