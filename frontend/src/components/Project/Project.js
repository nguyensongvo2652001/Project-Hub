import classes from "./Project.module.css";
import ProjectMainInfo from "./ProjectMainInfo";

import { getDateDisplay } from "../../utils/date";

const Project = (props) => {
  const { project, lastProjectElement } = props; //lastProjectElement can be undefined if the project is not the last project for display

  let descriptionDisplay = project.description || "";
  if (descriptionDisplay.length > 120) {
    descriptionDisplay = descriptionDisplay.slice(0, 117) + "...";
  }

  const lastChangeDisplayDate = getDateDisplay(project.lastChanged);
  const displayCreatedAtDate = getDateDisplay(project.dateCreated);

  const mainInfo = {
    projectId: project._id,
    description: project.description,
    name: project.name,
    tag: project.tag,
  };

  return (
    <li className={classes.project} ref={lastProjectElement}>
      <ProjectMainInfo mainInfo={mainInfo} />

      <div className={classes.project__additionalInfoSection}>
        <div className={classes.project__additionalInfo}>
          <h3>Last change: </h3>
          <p>{lastChangeDisplayDate}</p>
        </div>

        <div className={classes.project__additionalInfo}>
          <h3>Created at: </h3>
          <p>{displayCreatedAtDate}</p>
        </div>
      </div>
    </li>
  );
};

export default Project;
