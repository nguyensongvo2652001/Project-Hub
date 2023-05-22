import { useState } from "react";

import TextAreaInput from "../TextAreaInput/TextAreaInput";
import TextInput from "../TextInput/TextInput";

import classes from "./NewProjectForm.module.css";
import RadioButton from "../RadioButton/RadioButton";

const NewProjectForm = (props) => {
  const [activeStatusOption, setActiveStatusOption] = useState("private");
  const statusOptions = ["Private", "Public"];
  const tagOptions = [
    "Website",
    "Mobile",
    "Software",
    "AI",
    "CloudComputing",
    "Security",
    "Other",
    "Data",
  ];

  return (
    <>
      <h2 className={classes.newProjectForm__title}>Create a new project</h2>
      <form className={classes.newProjectForm}>
        <div className={classes.newProjectForm__controlGroup}>
          <label className={classes.newProjectForm__label} id="name">
            Name
          </label>
          <TextInput
            id="name"
            placeholder="your project name"
            type="text"
            className={classes.newProjectForm__input}
          />
        </div>

        <div
          className={`${classes.newProjectForm__controlGroup} ${classes.newProjectForm__descriptionControlGroup}`}
        >
          <label className={classes.newProjectForm__label} for="description">
            Description
          </label>
          <TextAreaInput
            cols="50"
            id="description"
            placeholder="your project description"
            className={classes.newProjectForm__descriptionInput}
          />
        </div>

        <div className={classes.newProjectForm__controlGroup}>
          <label className={classes.newProjectForm__label} id="tag">
            Tag
          </label>
          <select className={classes.newProjectForm__tagDropdown}>
            {tagOptions.map((tag, index) => {
              return (
                <option value={tag} key={index}>
                  {tag}
                </option>
              );
            })}
          </select>
        </div>

        <div className={classes.newProjectForm__controlGroup}>
          <label className={classes.newProjectForm__label} id="status">
            Status
          </label>
          <div className={classes.newProjectForm__statusRadioButtons}>
            {statusOptions.map((status, index) => {
              const isActive = activeStatusOption === status.toLowerCase();
              return (
                <div
                  className={classes.newProjectForm__radioButtonContainer}
                  key={index}
                >
                  <RadioButton active={isActive} />
                  <p>{status}</p>
                </div>
              );
            })}
          </div>
        </div>

        <button className={classes.newProjectForm__submitButton}>
          Create a new project
        </button>
      </form>
    </>
  );
};

export default NewProjectForm;
