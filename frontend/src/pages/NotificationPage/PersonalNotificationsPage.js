import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import notificationPageStyle from "./NotificationPage.module.css";
import logo from "../../assets/avatar1.jpg";
import UserNameLink from "../../components/UserNameLink/UserNameLink";
import AvatarLink from "../../components/AvatarLink/AvatarLink";
import { useEffect, useRef, useState } from "react";
import NotificationList from "./NotificationList";

const PersonalNotificationsPage = (props) => {
  const [lastNotification, setLastNotification] = useState(null);
  const notifications = [
    {
      _id: "6458ccab4c60b4d0cb0496cb",
      initiator: {
        _id: "123456",
        avatar: logo,
        name: "Adam Johnson",
      },
      type: "some_type",
      dateCreated: "2023-05-08T10:19:23.362+00:00",
    },
    {
      _id: "6458ccab4c60b4d0cb0496ee",
      initiator: {
        _id: "123466",
        avatar: logo,
        name: "Tom Busy",
      },
      type: "some_type_2",
      dateCreated: "2023-05-08T10:19:23.362+00:00",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log(entries[0]);
          console.log("I SEE YOU !");
        }
      },
      { threshold: 1 }
    );

    if (lastNotification) {
      observer.observe(lastNotification);
    }

    return () => {
      if (lastNotification) {
        observer.unobserve(lastNotification);
      }
    };
  }, [lastNotification]);

  return (
    <AuthPageLayout>
      <div className={notificationPageStyle.notificationPage}>
        <h1 className={notificationPageStyle.notificationPage__title}>
          Your notifications
        </h1>

        <NotificationList
          notifications={notifications}
          lastNotificationRef={setLastNotification}
        />
      </div>
    </AuthPageLayout>
  );
};

export default PersonalNotificationsPage;
