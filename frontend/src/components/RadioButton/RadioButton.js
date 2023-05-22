import classes from "./RadioButton.module.css";

const RadioButton = (props) => {
  const { active } = props;
  let allClasses = `${props.className} ${classes.radioButton}`;
  if (active) {
    allClasses += ` ${classes["radioButton--active"]}`;
  }
  return <div className={allClasses}></div>;
};

export default RadioButton;
