import { useEffect, useState } from "react";
import classes from "./RadioButton.module.css";

const RadioButton = (props) => {
  const { active: defaultActive, value, turnOffStateManagement } = props;

  const [active, setActive] = useState(defaultActive);

  useEffect(() => {
    setActive(defaultActive);
  }, [defaultActive]);

  const onRadioButtonClick = () => {
    if (turnOffStateManagement) return;

    if (props.onClick) props.onClick(active, value);
    setActive((prev) => !prev);
  };

  let allClasses = `${props.className} ${classes.radioButton}`;
  if (active) {
    allClasses += ` ${classes["radioButton--active"]}`;
  }
  return <div className={allClasses} onClick={onRadioButtonClick}></div>;
};

export default RadioButton;
