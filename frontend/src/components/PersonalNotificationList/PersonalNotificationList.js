import AuthPageLayout from "../Layout/AuthPageLayout/AuthPageLayout";
import NotificationListContainer from "../NotificationListContainer/NotificationListContainer";
import SearchBarContainer from "../SearchBar/SearchBarContainer";

const PersonalNotificationList = (props) => {
  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <NotificationListContainer
        url={`${process.env.REACT_APP_BACKEND_BASE_URL}/me/notification`}
        title="Your notifications"
      />
    </AuthPageLayout>
  );
};

export default PersonalNotificationList;
