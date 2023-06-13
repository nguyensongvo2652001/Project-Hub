import { useState } from "react";
import classes from "./RadioButton.module.css";

const RadioButton = (props) => {
  const { active: defaultActive, value, onClick } = props;

  const [active, setActive] = useState(defaultActive);

  const onRadioButtonClick = () => {
    props.onClick(active, value);
    setActive((prev) => !prev);
  };

  let allClasses = `${props.className} ${classes.radioButton}`;
  if (active) {
    allClasses += ` ${classes["radioButton--active"]}`;
  }
  return <div className={allClasses} onClick={onRadioButtonClick}></div>;
};

export default RadioButton;
