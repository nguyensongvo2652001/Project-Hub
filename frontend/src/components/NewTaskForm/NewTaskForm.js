import Modal from "../UI/Modal/Modal.js";
import TextInput from "../TextInput/TextInput.js";
import TextAreaInput from "../TextAreaInput/TextAreaInput.js";

import classes from "./NewTaskForm.module.css";
import ChosenDevelopersRow from "../ChosenDevelopersRow/ChosenDevelopersRow.js";

const NewTaskForm = (props) => {
  const { project } = props;

  const allClasses = `${props.className} ${classes.newTaskFormContainer}`;

  return (
    <Modal className={allClasses} onClick={props.onClick}>
      <form className={classes.newTaskForm}>
        <h1 className={classes.newTaskForm__title}>Create a new task</h1>
        <div className={classes.newTaskForm__controlGroup}>
          <label className={classes.newTaskForm__label} htmlFor="name">
            Name
          </label>
          <TextInput
            placeholder="your task name here"
            id="name"
            type="text"
            className={classes.newTaskForm__controlGroupInput}
          />
        </div>

        <div className={classes.newTaskForm__controlGroup}>
          <label className={classes.newTaskForm__label} htmlFor="developers">
            Developers
          </label>
          <div className={classes.newTaskForm__controlGroupInput}>
            <ChosenDevelopersRow project={project} />
          </div>
        </div>

        <div className={classes.newTaskForm__controlGroup}>
          <label className={classes.newTaskForm__label} htmlFor="description">
            Description
          </label>
          <TextAreaInput
            className={`${classes.newTaskForm__controlGroupInput} ${classes.newTaskForm__descriptionInput}`}
            placeholder="your task description here"
            id="description"
            cols="50"
          />
        </div>

        <button className={classes.newTaskForm__submitButton}>Submit</button>
      </form>
    </Modal>
  );
};

export default NewTaskForm;
