import classes from "./Tag.module.css";

const Tag = (props) => {
  const tagClass = `tag--${props.tag.toLowerCase()}`;

  return (
    <div className={`${classes.tag} ${classes[tagClass]}`}>
      <p>{props.tag}</p>
    </div>
  );
};

export default Tag;
