import Card from "../../components/UI/Card/Card";
import ProjectNotFound from "./ProjectNotFound";
import ProjectMainInfo from "../../components/UI/ProjectMainInfo/ProjectMainInfo.js";

import classes from "./MostCompletedTasksProject.module.css";

const MostCompletedTasksProject = (props) => {
  const { info } = props;

  return (
    <Card className={classes.mostCompletedTasksProject}>
      <div>
        <div className={classes.mostCompletedTasksProject__title}>
          <ion-icon name="trophy-outline"></ion-icon>
          <p>Most completed tasks project</p>
        </div>
        {info && <ProjectMainInfo project={info.project} />}
      </div>

      {info && (
        <p className={classes.mostCompletedTasksProject__value}>
          <span>{info.completedTasksCount}</span> tasks completed.
        </p>
      )}

      {!info && <ProjectNotFound />}
    </Card>
  );
};

export default MostCompletedTasksProject;
