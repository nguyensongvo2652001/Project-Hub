import classes from "./Project.module.css";

const Project = (props) => {
  const { project } = props;

  const projectTagClass = `project__tag--${project.tag.toLowerCase()}`;

  let descriptionDisplay = project.description || "";
  console.log(descriptionDisplay.length);
  if (descriptionDisplay.length > 120) {
    descriptionDisplay = descriptionDisplay.slice(0, 117) + "...";
  }

  const lastChangeDisplayDate = project.lastChange;
  const displayCreatedAtDate = project.createdAt;

  return (
    <li className={classes.project}>
      <div className={classes.project__mainInfo}>
        <h2 className={classes.project__name}>{project.name}</h2>
        <div className={`${classes.project__tag} ${classes[projectTagClass]}`}>
          <p>{project.tag}</p>
        </div>
        <p className={classes.project__description}>{descriptionDisplay}</p>
      </div>

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
