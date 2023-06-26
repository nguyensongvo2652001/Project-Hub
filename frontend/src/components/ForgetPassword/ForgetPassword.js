import { Link } from "react-router-dom";
import Card from "../UI/Card/Card";

import { useContext, useRef, useState } from "react";
import Loading from "../UI/Loading/Loading";
import AuthContext from "../../contexts/AuthContext";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import NoAuthComponent from "../NoAuthComponent/NoAuthComponent";
import BlueBackground from "../UI/Background/BlueBackground";
import logo from "../../assets/logo.png";
import classes from "../ForgetPassword/ForgetPassword.module.css";
import NotificationContainer from "../UI/ErrorNotification/NotificationContainer";

const ForgetPassword = (props) => {
  const emailRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [sendEmailSuccessful, setSendEmailSuccessful] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;

    setIsLoading(true);

    try {
      if (!email) {
        throw new Error("email must be specified");
      }

      if (!isValidEmail(email)) {
        throw new Error("email is not valid");
      }

      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/forgotPassword`;

      const data = { email };
      const responseBody = await sendRequest(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const { status } = responseBody;

      if (status !== "success") {
        throw new Error(responseBody.message);
      }

      setSendEmailSuccessful(true);
      setUserEmail(email);
    } catch (err) {
      handleError(err);
    }

    setIsLoading(false);
  };

  return (
    <NoAuthComponent>
      <BlueBackground className={classes.forgetPasswordBackground}>
        <img
          src={logo}
          alt="ProjectHub logo"
          className={classes["forgetPasswordBackground__logo"]}
        />

        <Card className={classes.forgetPasswordContainer}>
          {!sendEmailSuccessful && (
            <form className={classes.forgetPassword}>
              <h1 className={classes["forgetPassword__title"]}>
                Forgot password
              </h1>

              <p className={classes.forgetPassword__info}>
                Enter the email address of your account so we can send you a
                link to reset your password
              </p>

              <div className={classes["forgetPassword__formGroup"]}>
                <label htmlFor="email">Email address</label>
                <input
                  ref={emailRef}
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              {isLoading && (
                <div className={classes["forgetPassword__loadingContainer"]}>
                  <Loading className={classes["forgetPassword__loading"]} />
                </div>
              )}
              {!isLoading && (
                <button
                  className={classes["forgetPassword__button"]}
                  onClick={submitHandler}
                >
                  Reset my password
                </button>
              )}
            </form>
          )}
          {sendEmailSuccessful && (
            <p className={classes.forgetPassword__successText}>
              We just send an email to {userEmail}. Please check your email for
              further information.
            </p>
          )}
        </Card>
      </BlueBackground>
      <NotificationContainer />
    </NoAuthComponent>
  );
};

export default ForgetPassword;
