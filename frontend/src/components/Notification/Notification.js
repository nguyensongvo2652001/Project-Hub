import { Link } from "react-router-dom";
import AvatarLink from "../AvatarLink/AvatarLink";
import classes from "./Notification.module.css";
import MyLink from "../MyLink/MyLink.js";

const Notification = (props) => {
  // project_invitation
  // project_invitation_confirm
  // project_new_task
  // project_update_task
  // project_delete_task
  // project_update

  const { lastNotificationRef, notification } = props;

  const dateDisplay = new Date(notification.dateCreated).toLocaleDateString(
    "en-GB"
  );

  const { type, detail, receiver } = notification;

  const notificationLinkAndMessageBasedOnType = {
    project_invitation: {
      message: `just invited you to project ${detail?.name}. Please check your email for more information.`,
      link: `/projects/${detail?._id}/publicDetail`,
    },
    project_invitation_confirm: {
      message: "just confirm to join the project",
      link: ``,
    },
    project_new_task: {
      message: `just created a new task ${detail?.name}.`,
      link: `/projects/${receiver}/tasks/${detail?._id}`,
    },
    project_update_task: {
      message: `just updated task ${detail?.name} info.`,
      link: `/projects/${receiver}/tasks/${detail?._id}`,
    },
    project_delete_task: {
      message: `jest deleted task ${detail?.name}`,
      link: `/projects/${receiver}/tasks/${detail?._id}`,
    },
    project_update: {
      message: "just updated project info.",
      link: `/projects/${detail?._id}`,
    },
  };

  let message = "just triggered a notification";
  let link = "";

  const messageAndLink = notificationLinkAndMessageBasedOnType[type];
  if (messageAndLink) {
    message = messageAndLink.message;
    link = messageAndLink.link;
  }

  return (
    <li className={classes.notification} ref={lastNotificationRef}>
      <AvatarLink
        className={classes.notification__initiatorAvatar}
        src={notification.initiator.avatar}
        id={notification.initiator._id}
        alt="Initiator avatar"
      />
      <div className={classes.notification__content}>
        <p className={classes.notification__message}>
          <MyLink
            text={notification.initiator.name}
            link={`users/${notification.initiator._id}`}
            className={classes.notification__initiatorName}
          />
          <span>{message}</span>
        </p>
        {link.length > 0 && (
          <Link to={link} className={classes.notification__moreInfoLink}>
            Click here for more info
          </Link>
        )}
      </div>
      <p className={classes.notification__date}>{dateDisplay}</p>
    </li>
  );
};

export default Notification;
