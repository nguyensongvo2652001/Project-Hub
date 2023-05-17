import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import notificationPageStyle from "./NotificationPage.module.css";
import { useEffect, useState } from "react";
import NotificationList from "../../components/NotificationList/NotificationList";
import useSendRequest from "../../hooks/useSendRequest";

const PersonalNotificationsPage = (props) => {
  const limit = 2;
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [lastNotification, setLastNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [noMoreNotifications, setNoMoreNotifications] = useState(false);
  const { sendRequest } = useSendRequest();

  useEffect(() => {
    const getMoreNotifications = async () => {
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/me/notification?limit=${limit}&page=${page}`;
      const responseBody = await sendRequest(url);

      const { data } = responseBody;

      if (data.length === 0) {
        setNoMoreNotifications(true);
        return;
      }

      const newNotifications = data.notifications;
      setNotifications((prev) => [...prev, ...newNotifications]);
    };
    getMoreNotifications();
  }, [page, isInitialRender, sendRequest]);

  useEffect(() => {
    // If the last notification is in the viewport => get more notifications by increasing the page
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (noMoreNotifications) {
            return observer.unobserve(lastNotification);
          }

          setPage((prev) => prev + 1);
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
  }, [lastNotification, noMoreNotifications]);

  return (
    <AuthPageLayout>
      <h1 className={notificationPageStyle.notificationPage__title}>
        Your notifications
      </h1>

      <div className={notificationPageStyle.notificationPage}>
        <NotificationList
          notifications={notifications}
          lastNotificationRef={setLastNotification}
        />
      </div>
    </AuthPageLayout>
  );
};

export default PersonalNotificationsPage;
