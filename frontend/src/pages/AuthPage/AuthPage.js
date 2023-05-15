import LoginForm from "../../components/AuthForm/LoginForm";
import NoAuthComponent from "../../components/NoAuthComponent/NoAuthComponent";
import BlueBackground from "../../components/UI/Background/BlueBackground";

import authPageStyles from "./AuthPage.module.css";
import logo from "../../assets/logo.png";
import SignUpForm from "../../components/AuthForm/SignUpForm";

const AuthPage = (props) => {
  const { isSignIn } = props;

  return (
    <NoAuthComponent>
      <BlueBackground className={authPageStyles.authPage}>
        <img
          src={logo}
          alt="ProjectHub logo"
          className={authPageStyles["authPage__logo"]}
        />
        {isSignIn && <LoginForm />}
        {!isSignIn && <SignUpForm />}
      </BlueBackground>
    </NoAuthComponent>
  );
};

export default AuthPage;
