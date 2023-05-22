import ProjectNameLink from "../ProjectLink/ProjectNameLink";
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
      <ProjectNameLink name={mainInfo.name} projectId={mainInfo.projectId} />
      <ProjecTag tag={mainInfo.tag} />

      <p className={classes.mainInfo__description}>{descriptionDisplay}</p>
    </div>
  );
};

export default ProjectMainInfo;
