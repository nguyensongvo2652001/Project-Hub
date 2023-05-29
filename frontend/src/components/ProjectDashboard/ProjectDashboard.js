import { useParams } from "react-router-dom";

import classes from "./ProjectDashboard.module.css";
import Dropdown from "../UI/Dropdown/Dropdown";
import { useContext, useState } from "react";
import ConstantContext from "../../contexts/ConstantContext";
import { capitalizeFirstLetter } from "../../utils/string";

const ProjectDashboard = (props) => {
  const constantContext = useContext(ConstantContext);

  const { id: projectId } = useParams();
  let projectName = "Twitter Clone ";

  if (projectName.length > 30) {
    projectName = projectName.slice(0, 27) + "...";
  }

  const [tasksCountBasedOnStatus, setTasksCountBasedOnStatus] = useState({
    open: 48,
    doing: 12,
    closed: 0,
    testing: 0,
    overdue: 52,
  });

  const taskStatusOptions = constantContext.TASK_STATUS_CONSTANT;
  const statusDropdownOptions = [
    "All",
    ...taskStatusOptions.map((status) => capitalizeFirstLetter(status)),
  ];

  return (
    <div className={classes.projectDashboard}>
      <header className={classes.projectDashboard__header}>
        <h1 className={classes.projectDashboard__projectName}>{projectName}</h1>
        <div className={classes.projectDashboard__header__buttonAndDropdown}>
          <button className={classes.projectDashboard__newTaskButton}>
            New Task
          </button>
          <Dropdown
            className={classes.projectDashboard__statusDropdown}
            options={statusDropdownOptions}
          />
        </div>
      </header>

      <ul className={classes.projectDashboard__taskStatRow}>
        {taskStatusOptions.map((option, index) => {
          let allClasses = `${classes.projectDashboard__taskStatBox} `;
          const classNameBasedOnStatus = `projectDashboard__taskStatBox--${option}`;
          allClasses += classes[classNameBasedOnStatus];
          return (
            <li key={index} className={allClasses}>
              <p className={classes.projectDashboard__taskStatValue}>
                {tasksCountBasedOnStatus[option]}
              </p>
              <p className={classes.projectDashboard__taskStatLabel}>
                {capitalizeFirstLetter(option)} Tasks
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProjectDashboard;
