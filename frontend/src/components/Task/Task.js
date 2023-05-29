import TaskCard from "../UI/TaskCard/TaskCard";

const Task = (props) => {
  return (
    <li ref={props.taskRef}>
      <TaskCard
        task={props.task}
        taskDisplayMetaInfo={props.taskDisplayMetaInfo}
        className={props.className}
      />
    </li>
  );
};

export default Task;
