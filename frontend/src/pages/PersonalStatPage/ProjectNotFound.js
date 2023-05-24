import notFoundImage from "../../assets/404.png";
import classes from "./ProjectNotFound.module.css";

const ProjectNotFound = () => {
  return (
    <>
      <img
        src={notFoundImage}
        alt="Giant 404 number"
        className={classes.projectNotFound__image}
      />
      <p className={classes.projectNotFound__text}>
        It looks like you have not joined any projects yet.
      </p>
    </>
  );
};

export default ProjectNotFound;
