import { Link } from "react-router-dom";

import classes from "./MyLink.module.css";

const MyLink = (props) => {
  const allClasses = `${classes.link} ${props.className}`;

  return (
    <Link to={props.link} className={allClasses}>
      {props.text}
    </Link>
  );
};

export default MyLink;
