import classes from "./Tag.module.css";

const Tag = (props) => {
  let allClasses = `${classes.tag} ${props.className}`;

  const specificTagClassName = `tag--${props.tag.toLowerCase()}`;
  allClasses += ` ${classes[specificTagClassName]}`;

  return (
    <div className={allClasses}>
      <p>{props.tag}</p>
    </div>
  );
};

export default Tag;
