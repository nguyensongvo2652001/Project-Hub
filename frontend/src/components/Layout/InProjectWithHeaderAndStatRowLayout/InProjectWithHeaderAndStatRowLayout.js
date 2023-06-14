import HeaderAndStatRowSection from "../../HeaderAndTaskStatRowSection/HeaderAndStatRowSection";

import classes from "./InProjectWithHeaderAndStatRowLayout.module.css";

const InProjectWithHeaderAndStatRowLayout = (props) => {
  const {
    dropDownOptions,
    project,
    shouldDisplayNewTaskButton,
    dropDownOnChange,
    statRowOptions,
    setStatRowOptions,
    setTasks,
    listStatus,
  } = props;

  return (
    <div className={classes.container}>
      <HeaderAndStatRowSection
        project={project}
        statRowOptions={statRowOptions}
        dropDownOptions={dropDownOptions}
        shouldDisplayNewTaskButton={shouldDisplayNewTaskButton}
        dropDownOnChange={dropDownOnChange}
        setTasks={setTasks}
        setStatRowOptions={setStatRowOptions}
        listStatus={listStatus}
      />
      {props.children}
    </div>
  );
};

export default InProjectWithHeaderAndStatRowLayout;
