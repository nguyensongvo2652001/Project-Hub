import { useState } from "react";
import classes from "./RadioButtonGroup.module.css";
import RadioButton from "../RadioButton/RadioButton";

const RadioButtonGroup = (props) => {
  const {
    options,
    handleNewActiveValue,
    defaultActiveOption,
    turnOffStateManagement,
  } = props;

  const [activeOption, setActiveOption] = useState(
    defaultActiveOption ? defaultActiveOption : props.options[0]
  );

  const onRadioButtonClick = (value) => {
    setActiveOption(value);

    handleNewActiveValue(value);
  };

  const allClasses = `${classes.radioButtonGroup} ${props.className}`;

  return (
    <ul className={allClasses}>
      {options.map((option, index) => {
        const isActive = option.toLowerCase() === activeOption.toLowerCase();
        return (
          <li
            className={classes.radioButtonContainer}
            key={index}
            value={option.toLowerCase()}
            onClick={() => onRadioButtonClick(option.toLowerCase())}
          >
            <RadioButton
              active={isActive}
              turnOffStateManagement={turnOffStateManagement}
            />
            <p>{option}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default RadioButtonGroup;
