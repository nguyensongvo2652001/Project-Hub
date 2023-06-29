import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RequiredAuthComponent = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      await authContext.checkIfUserIsLoggedIn();
      setIsLoading(false);
    };

    if (authContext.isLoggedIn === true) {
      setIsLoading(false);
    } else if (authContext.isLoggedIn === false) {
      navigate("/login");
    } else {
      checkLoginStatus();
    }
  }, [authContext, navigate]);

  if (isLoading) {
    return <p>IS LOADING</p>;
  }

  return <>{props.children}</>;
};

export default RequiredAuthComponent;
