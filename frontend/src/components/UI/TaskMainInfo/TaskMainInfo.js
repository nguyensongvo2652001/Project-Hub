import CardMainInfo from "../CardMainInfo/CardMainInfo.js";

const TaskMainInfo = (props) => {
  const { task } = props;

  const mainInfo = {
    name: task.name,
    tag: task.tag,
    description: task.description,
    link: "tasks/123",
  };

  return <CardMainInfo mainInfo={mainInfo} />;
};

export default TaskMainInfo;
