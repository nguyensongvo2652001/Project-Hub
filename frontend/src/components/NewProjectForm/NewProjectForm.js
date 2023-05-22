import { useRef, useState } from "react";

import TextAreaInput from "../TextAreaInput/TextAreaInput";
import TextInput from "../TextInput/TextInput";

import classes from "./NewProjectForm.module.css";
import RadioButton from "../RadioButton/RadioButton";
import useErrorHandling from "../../hooks/useErrorHandling";

const NewProjectForm = (props) => {
  const [activeStatusOption, setActiveStatusOption] = useState("private");
  const nameRef = useRef();
  const descriptionRef = useRef();
  const tagOptionsRef = useRef();

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

  const onRadioButtonClick = (value) => {
    setActiveStatusOption(value);
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();

    const name = nameRef.current.value;
    const description = descriptionRef.current.value;
    const tag = tagOptionsRef.current.value;
    const status = activeStatusOption;

    const data = {
      name,
      description,
      tag,
      status,
    };

    props.onSubmit(data);
  };

  return (
    <>
      <h2 className={classes.newProjectForm__title}>Create a new project</h2>
      <form className={classes.newProjectForm} onSubmit={onSubmitForm}>
        <div className={classes.newProjectForm__controlGroup}>
          <label className={classes.newProjectForm__label} htmlFor="name">
            Name
          </label>
          <TextInput
            id="name"
            placeholder="your project name"
            type="text"
            className={classes.newProjectForm__input}
            inputRef={nameRef}
          />
        </div>

        <div
          className={`${classes.newProjectForm__controlGroup} ${classes.newProjectForm__descriptionControlGroup}`}
        >
          <label
            className={classes.newProjectForm__label}
            htmlFor="description"
          >
            Description
          </label>
          <TextAreaInput
            cols="50"
            id="description"
            placeholder="your project description"
            className={classes.newProjectForm__descriptionInput}
            inputRef={descriptionRef}
          />
        </div>

        <div className={classes.newProjectForm__controlGroup}>
          <label className={classes.newProjectForm__label} id="tag">
            Tag
          </label>
          <select
            className={classes.newProjectForm__tagDropdown}
            ref={tagOptionsRef}
          >
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
          <div
            className={classes.newProjectForm__statusRadioButtons}
            value={activeStatusOption}
          >
            {statusOptions.map((status, index) => {
              const isActive = activeStatusOption === status.toLowerCase();
              return (
                <div
                  className={classes.newProjectForm__radioButtonContainer}
                  key={index}
                  value={status.toLowerCase()}
                  onClick={() => onRadioButtonClick(status.toLowerCase())}
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
