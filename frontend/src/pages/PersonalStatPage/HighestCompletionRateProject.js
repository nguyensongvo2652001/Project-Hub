import ProjectMainInfo from "../../components/Project/ProjectMainInfo";
import Card from "../../components/UI/Card/Card";

import classes from "./HighestCompletionRateProject.module.css";
import ProjectNotFound from "./ProjectNotFound";

const HighestCompletionRateProject = (props) => {
  const { info } = props;

  return (
    <Card className={classes.highestCompletionRateProject}>
      <div>
        <div className={classes.highestCompletionRateProject__title}>
          <ion-icon name="ribbon-outline"></ion-icon>
          <p>Project with highest completion rate</p>
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
        <div
          className={
            classes.highestCompletionRateProject__completionRateBarContainer
          }
        >
          <p className={classes.highestCompletionRateProject__label}>
            Completion Rate
          </p>
          <div className={classes.completionRateChart}>
            <div className={classes.completionRateBar}>
              <div className={classes.emptyBar}></div>
              <div
                className={classes.fillBar}
                style={{
                  width: `${info.completionRate}%`,
                }}
              ></div>
            </div>

            <p className={classes.completionRateBarValue}>
              {info.completionRate}%
            </p>
          </div>
        </div>
      )}
      {!info && <ProjectNotFound />}
    </Card>
  );
};

export default HighestCompletionRateProject;
