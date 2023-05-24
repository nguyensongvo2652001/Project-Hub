import Card from "../../components/UI/Card/Card";
import ProjectNotFound from "./ProjectNotFound";

import classes from "./MostCompletedTasksProject.module.css";
import ProjectMainInfo from "../../components/Project/ProjectMainInfo";

const MostCompletedTasksProject = (props) => {
  const { info } = props;

  return (
    <Card className={classes.mostCompletedTasksProject}>
      <div>
        <div className={classes.mostCompletedTasksProject__title}>
          <ion-icon name="trophy-outline"></ion-icon>
          <p>Most completed tasks project</p>
        </div>

        {info && (
          <ProjectMainInfo
            mainInfo={{
              name: info.project.name,
              tag: info.project.tag,
              description: info.project.description,
            }}
          />
        )}
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
