import styles from "./AuthPageLayout.module.css";
import MainNavBar from "../NavBar/MainNavBar";
import RequiredAuthComponent from "../RequiredAuthComponent/RequiredAuthComponent";

const AuthPageLayout = (props) => {
  return (
    <RequiredAuthComponent>
      <div className={styles.authPageLayout}>
        <MainNavBar />
        <div>{props.children}</div>
      </div>
    </RequiredAuthComponent>
  );
};

export default AuthPageLayout;
