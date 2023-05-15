import { Link } from "react-router-dom";
import Card from "../UI/Card/Card";

import authFormStyles from "./AuthForm.module.css";

const LoginForm = () => {
  return (
    <Card>
      <form className={authFormStyles.authForm}>
        <h1 className={authFormStyles["authForm__title"]}>Sign in</h1>

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
            <div className={authFormStyles["authForm__formGroupLabels"]}>
              <label htmlFor="password">Password</label>
              <Link
                to="/resetPassword"
                className={authFormStyles["authForm__link"]}
              >
                I forgot password
              </Link>
            </div>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="●●●●●●●●"
            />
          </div>
        </div>

        <button className={authFormStyles["authForm__button"]}>Sign in</button>

        <p className={authFormStyles["authForm__finalText"]}>
          <span>Don't have an account ?</span>
          <Link to="/signUp" className={authFormStyles["authForm__link"]}>
            Create an account
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default LoginForm;
