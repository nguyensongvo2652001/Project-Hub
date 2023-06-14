import CardMainInfo from "../CardMainInfo/CardMainInfo.js";

const TaskMainInfo = (props) => {
  const { task } = props;

  const mainInfo = {
    name: task.name,
    tag: task.status,
    description: task.description,
    link: `tasks/${task._id}`,
  };

  return <CardMainInfo mainInfo={mainInfo} />;
};

export default TaskMainInfo;
