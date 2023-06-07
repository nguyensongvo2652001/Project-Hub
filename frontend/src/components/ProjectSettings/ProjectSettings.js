import RadioButtonGroup from "../RadioButtonsGroup/RadioButtonGroup.js";
import TextAreaInput from "../TextAreaInput/TextAreaInput.js";
import TextInput from "../TextInput/TextInput.js";
import ProjectTagDropdown from "../UI/ProjectTagDropdown/ProjectTagDropdown.js";
import Loading from "../UI/Loading/Loading.js";

import useSendRequest from "../../hooks/useSendRequest.js";
import { useRef, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling.js";

import classes from "./ProjectSettings.module.css";

import { successAlert } from "../../utils/alert.js";

const ProjectSettings = (props) => {
  const { project, setProject } = props;
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const projectVisibilityOptions = ["Private", "Public"];
  const [activeVisibilityOption, setActiveVisibilityOption] = useState(
    project.status
  );

  const projectNameInputRef = useRef();
  const projectTagInputRef = useRef();
  const projectDescriptionInputRef = useRef();

  const saveButtonOnClick = async (event) => {
    const data = {
      name: projectNameInputRef.current.value,
      description: projectDescriptionInputRef.current.value,
      tag: projectTagInputRef.current.value,
      status: activeVisibilityOption,
    };

    const updateProjectURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}`;

    setIsSendingRequest(true);
    try {
      const response = await sendRequest(updateProjectURL, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      setProject(response.data.project);

      setIsSendingRequest(false);
      successAlert("Update project successfully");
    } catch (err) {
      handleError(err);
    }

    setIsSendingRequest(false);
  };

  return (
    <div className={classes.projectSetting}>
      <header className={classes.projectSetting__header}>
        <h1 className={classes.projectSetting__projectName}>{project.name}</h1>
        {isSendingRequest && (
          <Loading
            className={classes.projectSetting__loadingWhenSendingRequest}
          />
        )}
        {!isSendingRequest && (
          <button
            className={classes.projectSetting__saveButton}
            onClick={saveButtonOnClick}
          >
            Save
          </button>
        )}
      </header>
      <form className={classes.projectSetting__form}>
        <div className={classes.projectSetting__formControlGroup}>
          <label htmlFor="projectName">Project Name</label>
          <TextInput
            type="text"
            placeholder="your project name here"
            defaultValue={project.name}
            id="projectName"
            className={classes.projectSetting__formInput}
            inputRef={projectNameInputRef}
          />
        </div>

        <div className={classes.projectSetting__formControlGroup}>
          <label htmlFor="projectTag">Tag</label>
          <ProjectTagDropdown
            className={classes.projectSetting__formInput}
            defaultOption={project.tag}
            inputRef={projectTagInputRef}
          />
        </div>

        <div className={classes.projectSetting__formControlGroup}>
          <label htmlFor="projectDescription">Description</label>
          <TextAreaInput
            cols="50"
            id="projectDescription"
            defaultValue={project.description}
            placeholder="your project description here"
            className={classes.projectSetting__formInput}
            inputRef={projectDescriptionInputRef}
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
            defaultActiveOption={activeVisibilityOption}
          />
        </div>
      </form>
    </div>
  );
};

export default ProjectSettings;
