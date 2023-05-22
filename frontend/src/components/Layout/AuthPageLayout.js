import styles from "./AuthPageLayout.module.css";
import MainNavBar from "../NavBar/MainNavBar";
import RequiredAuthComponent from "../RequiredAuthComponent/RequiredAuthComponent";
import ErrorNotificationContainer from "../UI/ErrorNotification/ErrorNotificationContainer";

const AuthPageLayout = (props) => {
  return (
    <RequiredAuthComponent>
      <div className={styles.authPageLayout}>
        <MainNavBar />
        <div>{props.children}</div>
      </div>
      <ErrorNotificationContainer />
    </RequiredAuthComponent>
  );
};

export default AuthPageLayout;
