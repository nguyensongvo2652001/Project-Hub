import Notification from "../Notification/Notification";
import styles from "./NotificationList.module.css";

const NotificationList = (props) => {
  let { lastNotificationRef, notifications } = props;

  const notificationList = notifications.map((notification, index) => {
    if (index === notifications.length - 1) {
      return (
        <Notification
          notification={notification}
          lastNotificationRef={lastNotificationRef}
          key={notification._id}
        />
      );
    }

    return <Notification notification={notification} key={notification._id} />;
  });

  return <ul className={styles.notificationList}>{notificationList}</ul>;
};

export default NotificationList;
