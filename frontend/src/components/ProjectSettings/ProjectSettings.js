import RadioButtonGroup from "../RadioButtonsGroup/RadioButtonGroup.js";
import TextAreaInput from "../TextAreaInput/TextAreaInput.js";
import TextInput from "../TextInput/TextInput.js";
import ProjectTagDropdown from "../UI/ProjectTagDropdown/ProjectTagDropdown.js";
import Loading from "../UI/Loading/Loading.js";
import ConfirmModal from "../ConfirmationModal/ConfirmModal.js";

import useSendRequest from "../../hooks/useSendRequest.js";
import { useRef, useState } from "react";
import useErrorHandling from "../../hooks/useErrorHandling.js";
import { useNavigate } from "react-router-dom";

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

  const [showLeaveProjectConfirmModal, setShowLeaveProjectConfirmModal] =
    useState(false);
  const [showDeleteProjectConfirmModal, setShowDeleteProjectConfirmModal] =
    useState(false);

  const openLeaveProjectConfirmModal = () => {
    setShowLeaveProjectConfirmModal(true);
  };
  const openDeleteProjectConfirmModal = () => {
    setShowDeleteProjectConfirmModal(true);
  };
  const closeLeaveProjectConfirmModal = () => {
    setShowLeaveProjectConfirmModal(false);
  };
  const closeDeleteProjectConfirmModal = () => {
    setShowDeleteProjectConfirmModal(false);
  };

  const navigate = useNavigate();

  const leaveProject = async () => {
    const leaveProjectURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/me/leaveProject`;
    const data = { projectId: project._id };

    const response = await sendRequest(leaveProjectURL, {
      method: "DELETE",
      body: JSON.stringify(data),
    });

    if (response.status !== "success") {
      throw new Error(response.message);
    }

    successAlert("Leave project successfully");

    setTimeout(() => {
      navigate("/projects");
    }, 1500);
  };

  const deleteProject = async () => {
    const deleteProjectURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}`;

    const response = await sendRequest(deleteProjectURL, {
      method: "DELETE",
    });

    if (response.status !== "success") {
      throw new Error(response.message);
    }

    successAlert("Delete project successfully");

    setTimeout(() => {
      navigate("/projects");
    }, 1500);
  };

  return (
    <div className={classes.projectSetting}>
      {showLeaveProjectConfirmModal && (
        <ConfirmModal
          question={`Are you sure you want to leave project ${project.name} ?`}
          closeModal={closeLeaveProjectConfirmModal}
          onConfirm={leaveProject}
        />
      )}
      {showDeleteProjectConfirmModal && (
        <ConfirmModal
          question={`Are you sure you want to delete project ${project.name} ?`}
          closeModal={closeDeleteProjectConfirmModal}
          onConfirm={deleteProject}
        />
      )}
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

      <div className={classes.projectSetting__footerButtons}>
        <button
          className={classes.projectSetting__leaveProjectButton}
          onClick={openLeaveProjectConfirmModal}
        >
          Leave this project
        </button>

        <button
          className={classes.projectSetting__deleteProjectButton}
          onClick={openDeleteProjectConfirmModal}
        >
          Delete this project
        </button>
      </div>
    </div>
  );
};

export default ProjectSettings;
