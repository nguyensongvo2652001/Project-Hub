import Modal from "../UI/Modal/Modal.js";
import TextInput from "../TextInput/TextInput.js";
import TextAreaInput from "../TextAreaInput/TextAreaInput.js";

import classes from "./NewTaskForm.module.css";
import ChosenDevelopersRow from "../ChosenDevelopersRow/ChosenDevelopersRow.js";
import { useRef, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest.js";
import useErrorHandling from "../../hooks/useErrorHandling.js";
import { successAlert } from "../../utils/alert.js";
import Loading from "../UI/Loading/Loading.js";

const NewTaskForm = (props) => {
  const { project, setTasks, setStatRowOptions, closeNewTaskForm, listStatus } =
    props;

  const allClasses = `${props.className} ${classes.newTaskFormContainer}`;

  const [isLoading, setIsLoading] = useState(false);
  const taskNameRef = useRef();
  const [chosenDevelopers, setChosenDevelopers] = useState([]);
  const taskDescriptionRef = useRef();
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const onSubmitButtonClick = async (event) => {
    event.preventDefault();

    const rawData = {
      name: taskNameRef.current.value,
      developers: chosenDevelopers.map((developer) => developer._id),
      description: taskDescriptionRef.current.value,
      projectId: project._id,
    };

    try {
      setIsLoading(true);
      const createTaskURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/task`;
      const response = await sendRequest(createTaskURL, {
        method: "POST",
        body: JSON.stringify(rawData),
      });

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const { task } = response.data;

      if (listStatus === "All" || listStatus === "Open") {
        setTasks((tasks) => {
          const newTasks = tasks.slice();
          newTasks.unshift(task);
          return newTasks;
        });
      }

      setStatRowOptions((statRowOptions) => {
        const newStatRowOptions = statRowOptions.slice();

        //For project dashboard, the first option is the number of open tasks. When we create a new task => the number of open tasks will be increased by 1.
        newStatRowOptions[0] = {
          label: statRowOptions[0].label,
          value: statRowOptions[0].value + 1,
        };

        return newStatRowOptions;
      });

      successAlert("create new task successfully");

      closeNewTaskForm();
    } catch (err) {
      handleError(err);
    }

    setIsLoading(false);
  };

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
            inputRef={taskNameRef}
          />
        </div>

        <div className={classes.newTaskForm__controlGroup}>
          <label className={classes.newTaskForm__label} htmlFor="developers">
            Developers
          </label>
          <div className={classes.newTaskForm__controlGroupInput}>
            <ChosenDevelopersRow
              project={project}
              setChosenDevelopers={setChosenDevelopers}
              chosenDevelopers={chosenDevelopers}
              allowedEdit={true}
            />
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
            inputRef={taskDescriptionRef}
          />
        </div>

        {!isLoading && (
          <button
            className={classes.newTaskForm__submitButton}
            onClick={onSubmitButtonClick}
          >
            Submit
          </button>
        )}
        {isLoading && <Loading className={classes.newTaskForm__loading} />}
      </form>
    </Modal>
  );
};

export default NewTaskForm;
