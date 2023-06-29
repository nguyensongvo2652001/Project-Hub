import { useParams } from "react-router-dom";
import NotificationContainer from "../UI/ErrorNotification/NotificationContainer";
import NoAuthComponent from "../NoAuthComponent/NoAuthComponent";
import BlueBackground from "../UI/Background/BlueBackground";
import classes from "./ResetPassword.module.css";
import { useContext, useRef, useState } from "react";
import Card from "../UI/Card/Card";
import logo from "../../assets/logo.png";
import Loading from "../UI/Loading/Loading";
import useErrorHandling from "../../hooks/useErrorHandling";
import useSendRequest from "../../hooks/useSendRequest";
import AuthContext from "../../contexts/AuthContext";

const ResetPassword = () => {
  const authContext = useContext(AuthContext);
  const newPasswordRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { token: resetPasswordToken } = params;
  const handleError = useErrorHandling();
  const [showPassword, setShowPassword] = useState(false);
  const { sendRequest } = useSendRequest();

  const newPasswordInputType = showPassword ? "text" : "password";
  const newPasswordPlaceHolder = showPassword ? "yourPasswordHere" : "●●●●●●●●";

  const changePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const newPassword = newPasswordRef.current.value;

    setIsLoading(true);

    try {
      if (!newPassword) {
        throw new Error("password must be specified");
      }

      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/resetPassword/${resetPasswordToken}`;

      const data = { password: newPassword };
      const responseBody = await sendRequest(url, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      const { status } = responseBody;

      if (status !== "success") {
        throw new Error(responseBody.message);
      }

      await authContext.logIn();
    } catch (err) {
      handleError(err);
    }

    setIsLoading(false);
  };

  return (
    <NoAuthComponent>
      <BlueBackground className={classes.resetPasswordBackground}>
        <img
          src={logo}
          alt="ProjectHub logo"
          className={classes["resetPasswordBackground__logo"]}
        />

        <Card className={classes.resetPasswordContainer}>
          <form className={classes.resetPassword}>
            <h1 className={classes["resetPassword__title"]}>Reset password</h1>

            <p className={classes.resetPassword__info}>
              Enter new password for your account.
            </p>

            <div
              className={`${classes["resetPassword__formGroup"]} ${classes["resetPassword__passwordFormGroup"]}`}
            >
              <label htmlFor="password">New password</label>

              <input
                ref={newPasswordRef}
                type={newPasswordInputType}
                id="password"
                name="password"
                placeholder={newPasswordPlaceHolder}
              />
              <div
                className={classes["resetPassword__passwordVisibilityIcon"]}
                onClick={changePasswordVisibility}
              >
                {!showPassword && <ion-icon name="eye-outline"></ion-icon>}
                {showPassword && <ion-icon name="eye-off-outline"></ion-icon>}
              </div>
            </div>

            {isLoading && (
              <div className={classes["resetPassword__loadingContainer"]}>
                <Loading className={classes["resetPassword__loading"]} />
              </div>
            )}
            {!isLoading && (
              <button
                className={classes["resetPassword__button"]}
                onClick={submitHandler}
              >
                Reset my password
              </button>
            )}
          </form>
        </Card>
      </BlueBackground>
      <NotificationContainer />
    </NoAuthComponent>
  );
};

export default ResetPassword;
