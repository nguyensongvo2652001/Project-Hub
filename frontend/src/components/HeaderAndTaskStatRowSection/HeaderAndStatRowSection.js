import { useState } from "react";
import Dropdown from "../UI/Dropdown/Dropdown";

import classes from "./HeaderAndStatRowSection.module.css";
import NewTaskForm from "../NewTaskForm/NewTaskForm";
import NewMemberModal from "../NewMemberModal/NewMemberModal";

const HeaderAndStatRowSection = (props) => {
  const {
    project,
    dropDownOptions,
    dropDownOnChange,
    shouldDisplayNewTaskButton,
    shouldDisplayNewMemberButton,
    statRowOptions,
    setStatRowOptions,
    setTasks,
    listStatus,
  } = props;

  let displayProjectName = project.name;
  if (displayProjectName.length > 30) {
    displayProjectName = displayProjectName.slice(0, 27) + "...";
  }

  const [showNewTaskFormModal, setShowNewTaskFormModal] = useState(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const onNewTaskButtonClick = () => {
    setShowNewTaskFormModal(true);
  };
  const onNewMemberButtonClick = () => {
    setShowNewMemberModal(true);
  };
  const closeNewTaskFormmodal = () => {
    setShowNewTaskFormModal(false);
  };
  const closeNewMemberModal = () => {
    setShowNewMemberModal(false);
  };

  return (
    <>
      <header className={classes.header}>
        <h1 className={classes.header__projectName}>{displayProjectName}</h1>
        <div className={classes.header__buttonAndDropdown}>
          {showNewTaskFormModal && (
            <NewTaskForm
              onClick={closeNewTaskFormmodal}
              project={project}
              setTasks={setTasks}
              setStatRowOptions={setStatRowOptions}
              closeNewTaskForm={closeNewTaskFormmodal}
              listStatus={listStatus}
            />
          )}
          {showNewMemberModal && (
            <NewMemberModal project={project} onClick={closeNewMemberModal} />
          )}
          {shouldDisplayNewTaskButton && (
            <button
              className={classes.header__newTaskButton}
              onClick={onNewTaskButtonClick}
            >
              New Task
            </button>
          )}
          {shouldDisplayNewMemberButton && (
            <button
              className={classes.header__newTaskButton}
              onClick={onNewMemberButtonClick}
            >
              New Member
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
