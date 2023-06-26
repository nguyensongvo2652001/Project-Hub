import { Link } from "react-router-dom";
import Card from "../UI/Card/Card";

import authFormStyles from "./AuthForm.module.css";
import { useContext, useRef, useState } from "react";
import Loading from "../UI/Loading/Loading";
import ErrorMessage from "../UI/ErrorMessage/ErrorMessage";
import AuthContext from "../../contexts/AuthContext";
import useSendRequest from "../../hooks/useSendRequest";

const AuthForm = (props) => {
  const authContext = useContext(AuthContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setIsErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputType = showPassword ? "text" : "password";
  const passwordPlaceHolder = showPassword ? "yourPasswordHere" : "●●●●●●●●";
  const { sendRequest } = useSendRequest();

  const changePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email) {
      setIsError(true);
      setIsErrorMessage("Email can not be empty");
      return;
    }

    if (!isValidEmail(email)) {
      setIsError(true);
      setIsErrorMessage("Email is invalid");
      return;
    }

    if (!password) {
      setIsError(true);
      setIsErrorMessage("Password can not be empty");
      return;
    }

    setIsLoading(true);

    try {
      const url = isSignIn
        ? `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login`
        : `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/signUp`;

      const data = { email, password };
      const responseBody = await sendRequest(url, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const { status } = responseBody;

      if (status !== "success") {
        setIsError(true);
        setIsErrorMessage(responseBody.message);
      } else {
        await authContext.logIn();
      }
    } catch (err) {
      setIsError(true);
      setIsErrorMessage("something just went really wrong");
    }

    setIsLoading(false);
  };

  const { isSignIn } = props;

  const formTitle = isSignIn ? "Sign in" : "Sign up";
  const buttonText = isSignIn ? "Sign in" : "Create an account";
  const finalQuestion = isSignIn
    ? "Don't have an account ?"
    : "Already had an account ?";
  const finalLink = isSignIn ? "/signUp" : "/login";
  const finalLinkText = isSignIn ? "Create an account" : "Log in";
  return (
    <Card className={authFormStyles.authFormContainer}>
      <form className={authFormStyles.authForm}>
        <h1 className={authFormStyles["authForm__title"]}>{formTitle}</h1>

        <div className={authFormStyles["authForm__formGroups"]}>
          <div className={authFormStyles["authForm__formGroup"]}>
            <label htmlFor="email">Email address</label>
            <input
              ref={emailRef}
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>

          <div
            className={`${authFormStyles["authForm__formGroup"]} ${authFormStyles["authForm__passwordFormGroup"]}`}
          >
            <div className={authFormStyles["authForm__formGroupLabels"]}>
              <label htmlFor="password">Password</label>
              {isSignIn && (
                <Link
                  to="/forgetPassword"
                  className={authFormStyles["authForm__link"]}
                >
                  I forgot password
                </Link>
              )}
            </div>

            <input
              ref={passwordRef}
              type={passwordInputType}
              id="password"
              name="password"
              placeholder={passwordPlaceHolder}
            />
            <div
              className={authFormStyles["authForm__passwordVisibilityIcon"]}
              onClick={changePasswordVisibility}
            >
              {!showPassword && <ion-icon name="eye-outline"></ion-icon>}
              {showPassword && <ion-icon name="eye-off-outline"></ion-icon>}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className={authFormStyles["authForm__loadingContainer"]}>
            <Loading className={authFormStyles["authForm__loading"]} />
          </div>
        )}
        {!isLoading && (
          <button
            className={authFormStyles["authForm__button"]}
            onClick={submitHandler}
          >
            {buttonText}
          </button>
        )}

        <p className={authFormStyles["authForm__finalText"]}>
          <span>{finalQuestion}</span>
          <Link to={finalLink} className={authFormStyles["authForm__link"]}>
            {finalLinkText}
          </Link>
        </p>

        {!isLoading && isError && (
          <div className={authFormStyles["authForm__errorMessageContainer"]}>
            <ErrorMessage message={errorMessage} />
          </div>
        )}
      </form>
    </Card>
  );
};

export default AuthForm;
