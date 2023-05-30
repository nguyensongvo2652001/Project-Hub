import InProjectLayout from "../Layout/InProjectLayout/InProjectLayout.js";
import NotificationListContainer from "../NotificationListContainer/NotificationListContainer";

const ProjectNotificationList = (props) => {
  return (
    <InProjectLayout>
      <NotificationListContainer
        url={`${process.env.REACT_APP_BACKEND_BASE_URL}/project/64644f24d72808f7e85af670/notification`}
        title="RoboTech"
      />
    </InProjectLayout>
  );
};

export default ProjectNotificationList;
