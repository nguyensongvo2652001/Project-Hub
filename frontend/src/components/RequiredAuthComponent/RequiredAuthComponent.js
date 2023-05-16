import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RequiredAuthComponent = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      await authContext.checkIfUserIsLoggedIn();
      setIsLoading(false);
    };

    if (authContext.isLoggedIn === true) {
      setIsLoading(false);
    } else if (authContext.isLoggedIn === false) {
      navigate("/");
    } else {
      checkLoginStatus();
    }
  }, [authContext, navigate]);

  return (
    <>
      {isLoading && <p>IS LOADING</p>}
      {!isLoading && authContext.isLoggedIn && props.children}
    </>
  );
};

export default RequiredAuthComponent;
