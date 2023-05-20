import classes from "./ProjectTag.module.css";

const ProjecTag = (props) => {
  const projectTagClass = `projectTag--${props.tag.toLowerCase()}`;

  return (
    <div className={`${classes.projectTag} ${classes[projectTagClass]}`}>
      <p>{props.tag}</p>
    </div>
  );
};

export default ProjecTag;
