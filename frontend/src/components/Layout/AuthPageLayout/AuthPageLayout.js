import styles from "./AuthPageLayout.module.css";
import MainNavBar from "../../Navbars/MainNavBar/MainNavBar.js";
import RequiredAuthComponent from "../../RequiredAuthComponent/RequiredAuthComponent";
import NotificationContainer from "../../UI/ErrorNotification/NotificationContainer";

const AuthPageLayout = (props) => {
  return (
    <RequiredAuthComponent>
      <div className={styles.authPageLayout}>
        <MainNavBar />
        <div>{props.children}</div>
      </div>
      <NotificationContainer />
    </RequiredAuthComponent>
  );
};

export default AuthPageLayout;
