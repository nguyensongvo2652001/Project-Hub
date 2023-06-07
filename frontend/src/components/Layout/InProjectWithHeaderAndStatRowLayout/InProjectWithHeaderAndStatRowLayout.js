import HeaderAndStatRowSection from "../../HeaderAndTaskStatRowSection/HeaderAndStatRowSection";

import classes from "./InProjectWithHeaderAndStatRowLayout.module.css";

const InProjectWithHeaderAndStatRowLayout = (props) => {
  const {
    dropDownOptions,
    project,
    shouldDisplayNewTaskButton,
    dropDownOnChange,
    statRowOptions,
  } = props;

  return (
    <div className={classes.container}>
      <HeaderAndStatRowSection
        project={project}
        statRowOptions={statRowOptions}
        dropDownOptions={dropDownOptions}
        shouldDisplayNewTaskButton={shouldDisplayNewTaskButton}
        dropDownOnChange={dropDownOnChange}
      />
      {props.children}
    </div>
  );
};

export default InProjectWithHeaderAndStatRowLayout;
