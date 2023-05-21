import ProjecTag from "../UI/ProjectTag/ProjectTag";
import classes from "./ProjectMainInfo.module.css";

const ProjectMainInfo = (props) => {
  const { mainInfo } = props;

  let descriptionDisplay = mainInfo.description || "";
  if (descriptionDisplay.length > 120) {
    descriptionDisplay = descriptionDisplay.slice(0, 117) + "...";
  }

  return (
    <div className={classes.mainInfo}>
      <h2 className={classes.mainInfo__name}>{mainInfo.name}</h2>
      <ProjecTag tag={mainInfo.tag} />

      <p className={classes.mainInfo__description}>{descriptionDisplay}</p>
    </div>
  );
};

export default ProjectMainInfo;
