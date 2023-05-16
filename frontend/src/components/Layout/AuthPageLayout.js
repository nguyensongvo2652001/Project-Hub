import styles from "./AuthPageLayout.module.css";
import MainNavBar from "../NavBar/MainNavBar";

const AuthPageLayout = (props) => {
  return (
    <div className={styles.authPageLayout}>
      <MainNavBar />
      <div>{props.children}</div>
    </div>
  );
};

export default AuthPageLayout;
