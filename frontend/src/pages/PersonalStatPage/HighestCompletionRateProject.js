import ProjectNotFound from "./ProjectNotFound";
import ProjectMainInfo from "../../components/UI/ProjectMainInfo/ProjectMainInfo.js";
import Card from "../../components/UI/Card/Card.js";

import classes from "./HighestCompletionRateProject.module.css";

const HighestCompletionRateProject = (props) => {
  const { info } = props;

  return (
    <Card className={classes.highestCompletionRateProject}>
      <div>
        <div className={classes.highestCompletionRateProject__title}>
          <ion-icon name="ribbon-outline"></ion-icon>
          <p>Project with highest completion rate</p>
        </div>
        {info && <ProjectMainInfo project={info.project} />}
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
