import { useState } from "react";
import HeaderAndTaskStatRowSection from "../../HeaderAndTaskStatRowSection/HeaderAndTaskStatRowSection";
import InProjectLayout from "../InProjectLayout/InProjectLayout";

import classes from "./InProjectWithHeaderAndTaskStatRowLayout.module.css";

const InProjectWithHeaderAndTaskStatRowLayout = (props) => {
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

  return (
    <InProjectLayout>
      <div className={classes.container}>
        <HeaderAndTaskStatRowSection
          project={project}
          tasksCountBasedOnStatus={tasksCountBasedOnStatus}
        />
        {props.children}
      </div>
    </InProjectLayout>
  );
};

export default InProjectWithHeaderAndTaskStatRowLayout;
