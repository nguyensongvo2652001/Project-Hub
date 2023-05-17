import { Link } from "react-router-dom";
import AvatarLink from "../AvatarLink/AvatarLink";
import UserNameLink from "../UserNameLink/UserNameLink";
import notificationStyles from "./Notification.module.css";

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

  const { type, detail } = notification;
  let message = "just triggers a notification";
  let link = "";
  if (type === "project_invitation") {
    // In this case detail is the project info
    message = `just invited you to project ${detail.name}. Please check your email for more information.`;
    link = `/projects/${detail._id}`;
  }

  if (type === "project_update") {
    // In this case detail is the project info
    message = `just updated project info`;
    link = `/projects/${detail._id}`;
  }

  // For below cases, detail is the task info
  if (type.includes("task") && type !== "project_delete_task") {
    if (type === "project_new_task")
      message = `just created a new task ${detail.name}.`;
    if (type === "project_update_task")
      message = `just updated task ${detail.name} info.`;
    link = `/tasks/${detail._id}`;
  }

  // For this case, the detail is just the name of the deleted task.
  if (type === "project_delete_task") {
    message = `jest deleted task ${detail.name}`;
  }

  return (
    <li className={notificationStyles.notification} ref={lastNotificationRef}>
      <AvatarLink
        className={notificationStyles.notification__initiatorAvatar}
        src={notification.initiator.avatar}
        id={notification.initiator._id}
        alt="Initiator avatar"
      />
      <div className={notificationStyles.notification__content}>
        <div className={notificationStyles.notification__message}>
          <UserNameLink
            name={notification.initiator.name}
            id={notification.initiator._id}
          />
          <p>{message}</p>
        </div>
        {link.length > 0 && (
          <Link
            to={link}
            className={notificationStyles.notification__moreInfoLink}
          >
            Click here for more info{" "}
          </Link>
        )}
      </div>
      <p className={notificationStyles.notification__date}>{dateDisplay}</p>
    </li>
  );
};

export default Notification;
