import Dropdown from "../UI/Dropdown/Dropdown";
import ConstantContext from "../../contexts/ConstantContext.js";

import { useContext } from "react";

import { capitalizeFirstLetter } from "../../utils/string";

import classes from "./HeaderAndTaskStatRowSection.module.css";

const HeaderAndTaskStatRowSection = (props) => {
  const { project, tasksCountBasedOnStatus, dropDownOptions } = props;
  const constantContext = useContext(ConstantContext);

  const taskStatusOptions = constantContext.TASK_STATUS_CONSTANT;

  let displayProjectName = project.name;
  if (displayProjectName.length > 30) {
    displayProjectName = displayProjectName.slice(0, 27) + "...";
  }

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.header__projectName}>{displayProjectName}</h1>
        <div className={classes.header__buttonAndDropdown}>
          <button className={classes.header__newTaskButton}>New Task</button>
          <Dropdown
            className={classes.header__statusDropdown}
            options={dropDownOptions}
          />
        </div>
      </header>

      <ul className={classes.taskStatRow}>
        {taskStatusOptions.map((option, index) => {
          let allClasses = `${classes.taskStatBox} `;
          const classNameBasedOnStatus = `taskStatBox--${option}`;
          allClasses += classes[classNameBasedOnStatus];
          return (
            <li key={index} className={allClasses}>
              <p className={classes.taskStatValue}>
                {tasksCountBasedOnStatus[option]}
              </p>
              <p className={classes.taskStatLabel}>
                {capitalizeFirstLetter(option)} Tasks
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default HeaderAndTaskStatRowSection;
