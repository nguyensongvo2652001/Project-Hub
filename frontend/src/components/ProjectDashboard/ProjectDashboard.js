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
import HeaderAndTaskStatRowSection from "../HeaderAndTaskStatRowSection/HeaderAndTaskStatRowSection.js";

const ProjectDashboard = (props) => {
  const project = {
    name: "Twitter Clone",
  };

  const [tasksCountBasedOnStatus, setTasksCountBasedOnStatus] = useState({
    open: 48,
    doing: 12,
    closed: 0,
    testing: 0,
    overdue: 52,
  });

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
      <HeaderAndTaskStatRowSection
        project={project}
        tasksCountBasedOnStatus={tasksCountBasedOnStatus}
      />

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
