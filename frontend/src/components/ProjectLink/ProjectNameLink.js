import { Link } from "react-router-dom";

import classes from "./ProjectNameLink.module.css";

const ProjectNameLink = (props) => {
  return (
    <Link
      to={`/projects/${props.projectId}`}
      className={classes.projectNameLink}
    >
      {props.name}
    </Link>
  );
};

export default ProjectNameLink;
