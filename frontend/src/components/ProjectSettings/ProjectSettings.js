import { useState } from "react";
import InProjectLayout from "../Layout/InProjectLayout/InProjectLayout.js";
import RadioButtonGroup from "../RadioButtonsGroup/RadioButtonGroup.js";
import TextAreaInput from "../TextAreaInput/TextAreaInput.js";
import TextInput from "../TextInput/TextInput.js";
import ProjectTagDropdown from "../UI/ProjectTagDropdown/ProjectTagDropdown.js";

import classes from "./ProjectSettings.module.css";

const ProjectSettings = (props) => {
  const projectVisibilityOptions = ["Private", "Public"];
  const [activeVisibilityOption, setActiveVisibilityOption] = useState("");

  return (
    <InProjectLayout>
      <div className={classes.projectSetting}>
        <header className={classes.projectSetting__header}>
          <h1 className={classes.projectSetting__projectName}>Twitter Clone</h1>
          <button className={classes.projectSetting__saveButton}>Save</button>
        </header>
        <form className={classes.projectSetting__form}>
          <div className={classes.projectSetting__formControlGroup}>
            <label htmlFor="projectName">Project Name</label>
            <TextInput
              type="text"
              placeholder="your project name here"
              defaultValue="Twitter Clone"
              id="projectName"
              className={classes.projectSetting__formInput}
            />
          </div>

          <div className={classes.projectSetting__formControlGroup}>
            <label htmlFor="projectTag">Tag</label>
            <ProjectTagDropdown className={classes.projectSetting__formInput} />
          </div>

          <div className={classes.projectSetting__formControlGroup}>
            <label htmlFor="projectDescription">Description</label>
            <TextAreaInput
              cols="50"
              id="projectDescription"
              defaultValue="This is a project to clone Twitter for educational purpose"
              placeholder="your project description here"
              className={classes.projectSetting__formInput}
            />
          </div>

          <div className={classes.projectSetting__formControlGroup}>
            <label htmlFor="projectVisibility">Visibility</label>
            <RadioButtonGroup
              options={projectVisibilityOptions}
              handleNewActiveValue={(activeValue) => {
                setActiveVisibilityOption(activeValue);
              }}
              className={`${classes.projectSetting__formInput} ${classes.projectSetting__radioButtonGroup}`}
            />
          </div>
        </form>
      </div>
    </InProjectLayout>
  );
};

export default ProjectSettings;
