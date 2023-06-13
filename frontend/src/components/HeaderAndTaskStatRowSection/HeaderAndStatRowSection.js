import { useState } from "react";
import Dropdown from "../UI/Dropdown/Dropdown";

import classes from "./HeaderAndStatRowSection.module.css";
import NewTaskForm from "../NewTaskForm/NewTaskForm";

const HeaderAndStatRowSection = (props) => {
  const {
    project,
    dropDownOptions,
    dropDownOnChange,
    shouldDisplayNewTaskButton,
    statRowOptions,
  } = props;

  let displayProjectName = project.name;
  if (displayProjectName.length > 30) {
    displayProjectName = displayProjectName.slice(0, 27) + "...";
  }

  const [showNewTaskFormModal, setShowNewTaskFormModal] = useState(false);
  const onNewTaskButtonClick = () => {
    setShowNewTaskFormModal(true);
  };
  const closeNewTaskFormmodal = () => {
    setShowNewTaskFormModal(false);
  };

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.header__projectName}>{displayProjectName}</h1>
        <div className={classes.header__buttonAndDropdown}>
          {showNewTaskFormModal && (
            <NewTaskForm onClick={closeNewTaskFormmodal} project={project} />
          )}
          {shouldDisplayNewTaskButton && (
            <button
              className={classes.header__newTaskButton}
              onClick={onNewTaskButtonClick}
            >
              New Task
            </button>
          )}

          <Dropdown
            className={classes.header__statusDropdown}
            options={dropDownOptions}
            onChange={dropDownOnChange}
          />
        </div>
      </header>

      <ul className={classes.statRow}>
        {statRowOptions.map((option, index) => {
          let allClasses = `${classes.statBox} `;
          const classNameBasedOnStatus = `statBox--${option.label}`;
          allClasses += classes[classNameBasedOnStatus];
          return (
            <li key={index} className={allClasses}>
              <p className={classes.statValue}>{option.value}</p>
              <p className={classes.statLabel}>{option.label}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default HeaderAndStatRowSection;
