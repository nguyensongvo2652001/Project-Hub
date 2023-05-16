import AvatarLink from "../../components/AvatarLink/AvatarLink";
import UserNameLink from "../../components/UserNameLink/UserNameLink";
import notificationStyles from "./Notification.module.css";

const Notification = (props) => {
  console.log(props);
  const { lastNotificationRef, notification } = props;

  let message =
    "just sent you an invitation to a project. Please check your email for more information.";

  return (
    <li className={notificationStyles.notification} ref={lastNotificationRef}>
      <AvatarLink
        className={notificationStyles.notification__initiatorAvatar}
        src={notification.initiator.avatar}
        id={notification.initiator._id}
        alt="Initiator avatar"
      />
      <div className={notificationStyles.notification__content}>
        <UserNameLink
          name={notification.initiator.name}
          id={notification.initiator._id}
        />
        <p>{message}</p>
      </div>
      <p className={notificationStyles.notification__date}>
        {notification.dateCreated}
      </p>
    </li>
  );
};

export default Notification;
