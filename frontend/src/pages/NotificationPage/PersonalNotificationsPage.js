import AuthPageLayout from "../../components/Layout/AuthPageLayout/AuthPageLayout.js";
import Loading from "../../components/UI/Loading/Loading";
import notificationPageStyle from "./NotificationPage.module.css";
import { useCallback, useEffect, useState } from "react";
import NotificationList from "../../components/NotificationList/NotificationList";
import useSendRequest from "../../hooks/useSendRequest";
import NoDocumentsFound from "../../components/UI/NoDocumentsFound/NoDocumentsFound";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const PersonalNotificationsPage = (props) => {
  const limit = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [lastNotification, setLastNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [noMoreNotifications, setNoMoreNotifications] = useState(false);
  const { sendRequest } = useSendRequest();

  const checkIfThereAreNoMoreNotifications = useCallback(() => {
    return noMoreNotifications;
  }, [noMoreNotifications]);

  const setPageWhenLastNotificationInViewport = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  useIntersectionObserver(
    checkIfThereAreNoMoreNotifications,
    lastNotification,
    setPageWhenLastNotificationInViewport
  );

  useEffect(() => {
    const getMoreNotifications = async () => {
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/me/notification?limit=${limit}&page=${page}`;

      setIsLoading(true);
      const responseBody = await sendRequest(url);
      setIsLoading(false);

      const { data } = responseBody;

      if (data.length === 0) {
        setNoMoreNotifications(true);
        return;
      }

      const newNotifications = data.notifications;
      setNotifications((prev) => [...prev, ...newNotifications]);
    };

    if (noMoreNotifications) {
      return;
    }

    getMoreNotifications();
  }, [noMoreNotifications, page, isInitialRender, sendRequest]);

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={notificationPageStyle.notificationPage}>
        <h1 className={notificationPageStyle.notificationPage__title}>
          Your notifications
        </h1>

        {notifications.length > 0 && (
          <NotificationList
            notifications={notifications}
            lastNotificationRef={setLastNotification}
          />
        )}

        {!isLoading && (
          <NoDocumentsFound message="Unfortunately, it looks like we can not find any other notifications" />
        )}

        {isLoading && (
          <Loading
            className={notificationPageStyle.notificationPage__loading}
          />
        )}
      </div>
    </AuthPageLayout>
  );
};

export default PersonalNotificationsPage;
