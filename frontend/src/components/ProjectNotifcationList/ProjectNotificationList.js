import NotificationListContainer from "../NotificationListContainer/NotificationListContainer";

const ProjectNotificationList = (props) => {
  const { project } = props;

  return (
    <NotificationListContainer
      url={`${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/notification`}
      title={project.name}
    />
  );
};

export default ProjectNotificationList;
