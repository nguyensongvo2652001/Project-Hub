import Card from "../Card/Card";
import CardMetaInfo from "../CardMetaInfo/CardMetaInfo";
import TaskMainInfo from "../TaskMainInfo/TaskMainInfo";

const TaskCard = (props) => {
  return (
    <Card className={props.className}>
      <TaskMainInfo task={props.task} />

      <CardMetaInfo metaInfoList={props.taskDisplayMetaInfo} />
    </Card>
  );
};

export default TaskCard;
