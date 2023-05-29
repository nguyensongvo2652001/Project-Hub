import ConstantContext from "../../contexts/ConstantContext.js";
import Dropdown from "../UI/Dropdown/Dropdown.js";
import CardMainInfo from "../UI/CardMainInfo/CardMainInfo.js";
import CardMetaInfo from "../UI/CardMetaInfo/CardMetaInfo.js";
import Card from "../UI/Card/Card.js";

import { useParams } from "react-router-dom";
import { useContext, useState } from "react";

import classes from "./ProjectDashboard.module.css";

import { capitalizeFirstLetter } from "../../utils/string";
import TaskCard from "../UI/TaskCard/TaskCard.js";
import Task from "../Task/Task.js";

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

  const taskDisplayMetaInfo = [
    {
      title: "Start date: ",
      value: "24/12/2023",
    },
    {
      title: "Deadline: ",
      value: "1/1/2024",
    },
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

      <ul className={classes.projectDashboard__tasks}>
        <Task
          task={{
            name: "Fix followers count",
            tag: "Testing",
            description:
              "The followers count is not updated properly after the users press the follow button. Plrease check this",
          }}
          taskDisplayMetaInfo={taskDisplayMetaInfo}
          className={classes.projectDashboard__task}
        />

        <Task
          task={{
            name: "Fix followers count",
            tag: "Testing",
            description:
              "The followers count is not updated properly after the users press the follow button. Plrease check this",
          }}
          taskDisplayMetaInfo={taskDisplayMetaInfo}
          className={classes.projectDashboard__task}
        />

        <Task
          task={{
            name: "Fix followers count",
            tag: "Testing",
            description:
              "The followers count is not updated properly after the users press the follow button. Plrease check this",
          }}
          taskDisplayMetaInfo={taskDisplayMetaInfo}
          className={classes.projectDashboard__task}
        />
      </ul>
    </div>
  );
};

export default ProjectDashboard;
