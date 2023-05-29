import { useRef, useState } from "react";

import TextAreaInput from "../TextAreaInput/TextAreaInput";
import TextInput from "../TextInput/TextInput";

import classes from "./NewProjectForm.module.css";
import RadioButton from "../RadioButton/RadioButton";
import useErrorHandling from "../../hooks/useErrorHandling";
import Loading from "../UI/Loading/Loading";
import Dropdown from "../UI/Dropdown/Dropdown";

const NewProjectForm = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    await props.onSubmit(data);
    setIsSubmitting(false);
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
          <Dropdown
            inputRef={tagOptionsRef}
            options={tagOptions}
            className={classes.newProjectForm__tagDropdown}
          />
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
        {!isSubmitting && (
          <button className={classes.newProjectForm__submitButton}>
            Create a new project
          </button>
        )}
        {isSubmitting && (
          <Loading className={classes.newProjectForm__loading} />
        )}
      </form>
    </>
  );
};

export default NewProjectForm;
