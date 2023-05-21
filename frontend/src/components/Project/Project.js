import ProjecTag from "../UI/ProjectTag/ProjectTag";
import classes from "./Project.module.css";
import ProjectMainInfo from "./ProjectMainInfo";

const Project = (props) => {
  const { project } = props;

  let descriptionDisplay = project.description || "";
  if (descriptionDisplay.length > 120) {
    descriptionDisplay = descriptionDisplay.slice(0, 117) + "...";
  }

  const lastChangeDisplayDate = project.lastChange;
  const displayCreatedAtDate = project.createdAt;

  const mainInfo = {
    description: project.description,
    name: project.name,
    tag: project.tag,
  };

  return (
    <li className={classes.project}>
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
