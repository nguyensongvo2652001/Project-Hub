import { Link } from "react-router-dom";
import Card from "../UI/Card/Card";

import authFormStyles from "./AuthForm.module.css";

const SignUpForm = () => {
  return (
    <Card>
      <form className={authFormStyles.authForm}>
        <h1 className={authFormStyles["authForm__title"]}>Sign up</h1>

        <div className={authFormStyles["authForm__formGroups"]}>
          <div className={authFormStyles["authForm__formGroup"]}>
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>

          <div className={authFormStyles["authForm__formGroup"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="●●●●●●●●"
            />
          </div>
        </div>

        <button className={authFormStyles["authForm__button"]}>
          Create an account
        </button>

        <p className={authFormStyles["authForm__finalText"]}>
          <span>Already had an account ?</span>
          <Link to="/login" className={authFormStyles["authForm__link"]}>
            Sign in now
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default SignUpForm;
