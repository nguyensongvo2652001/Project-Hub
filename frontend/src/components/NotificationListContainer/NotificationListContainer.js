import NotificationList from "../NotificationList/NotificationList";
import NoDocumentsFound from "../UI/NoDocumentsFound/NoDocumentsFound";
import Loading from "../UI/Loading/Loading";

import { useCallback, useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

import classes from "./NotificationListContainer.module.css";

const NotificationListContainer = (props) => {
  const { url: urlToGetNotifications } = props;

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

      const url = `${urlToGetNotifications}?limit=${limit}&page=${page}`;

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
  }, [
    noMoreNotifications,
    page,
    isInitialRender,
    sendRequest,
    urlToGetNotifications,
  ]);

  return (
    <div className={classes.notificationContainer}>
      <h1 className={classes.notificationContainer__title}>{props.title}</h1>

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
        <Loading className={classes.notificationContainer__loading} />
      )}
    </div>
  );
};

export default NotificationListContainer;
