import Modal from "../UI/Modal/Modal";
import TextInput from "../TextInput/TextInput";
import TextAreaInput from "../TextAreaInput/TextAreaInput";
import Dropdown from "../UI/Dropdown/Dropdown";
import ConstantContext from "../../contexts/ConstantContext";
import ChosenDevelopersRow from "../../components/ChosenDevelopersRow/ChosenDevelopersRow";

import classes from "./EditTaskForm.module.css";
import { useContext, useRef, useState } from "react";
import Loading from "../UI/Loading/Loading";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { successAlert } from "../../utils/alert";

const EditTaskForm = (props) => {
  const { task, project } = props;

  const allClasses = `${props.className} ${classes.editTaskFormContainer}`;

  const taskNameRef = useRef();
  const taskStatusRef = useRef();
  const [taskDevelopers, setTaskDevelopers] = useState(task.developers);
  const taskStartDateRef = useRef();
  const taskDeadlineRef = useRef();
  const taskFinishDateRef = useRef();
  const taskDescriptionRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const constantContext = useContext(ConstantContext);
  const statusDropdownOptions = constantContext.TASK_STATUS_CONSTANT;

  const onSubmitButtonClick = async (event) => {
    event.preventDefault();

    const rawData = {
      name: taskNameRef.current.value,
      status: taskStatusRef.current.value,
      developers: taskDevelopers.map((developer) => developer._id),
      startDate: taskStartDateRef.current.value,
      deadline: taskDeadlineRef.current.value,
      finishDate: taskFinishDateRef.current.value,
      description: taskDescriptionRef.current.value,
    };

    setIsLoading(true);
    try {
      const updateTaskURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/task/${task._id}`;

      const response = await sendRequest(updateTaskURL, {
        method: "PATCH",
        body: JSON.stringify(rawData),
      });

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const newTask = response.data.task;
      props.setTask(newTask);

      successAlert("update task successfully");

      props.closeEditTaskForm();
    } catch (err) {
      handleError(err);
    }

    setIsLoading(false);
  };

  return (
    <Modal className={allClasses} onClick={props.closeEditTaskForm}>
      <form className={classes.editTaskForm}>
        <h1 className={classes.editTaskForm__title}>Edit task form</h1>
        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="name">
            Name
          </label>
          <TextInput
            placeholder="your task name here"
            defaultValue={task.name}
            id="name"
            type="text"
            className={classes.editTaskForm__controlGroupInput}
            inputRef={taskNameRef}
          />
        </div>

        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="status">
            Status
          </label>
          <Dropdown
            options={statusDropdownOptions}
            inputRef={taskStatusRef}
            defaultOption={task.status}
            className={classes.editTaskForm__controlGroupInput}
          />
        </div>

        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="developers">
            Developers
          </label>
          <div className={classes.editTaskForm__controlGroupInput}>
            <ChosenDevelopersRow
              project={project}
              setChosenDevelopers={setTaskDevelopers}
              chosenDevelopers={taskDevelopers}
              allowedEdit={true}
            />
          </div>
        </div>

        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="startDate">
            Start date
          </label>
          <div className={classes.editTaskForm__controlGroupInput}>
            <input
              type="date"
              id="startDate"
              defaultValue={task.startDate}
              ref={taskStartDateRef}
              className={classes.editTaskForm__controlGroupInput}
            />
          </div>
        </div>

        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="deadline">
            Deadline
          </label>
          <div className={classes.editTaskForm__controlGroupInput}>
            <input
              type="date"
              id="deadline"
              defaultValue={task.deadline}
              ref={taskDeadlineRef}
              className={classes.editTaskForm__controlGroupInput}
            />
          </div>
        </div>

        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="startDate">
            Finish date
          </label>
          <div className={classes.editTaskForm__controlGroupInput}>
            <input
              type="date"
              id="finishDate"
              defaultValue={task.finishDate}
              ref={taskFinishDateRef}
              className={classes.editTaskForm__controlGroupInput}
            />
          </div>
        </div>

        <div className={classes.editTaskForm__controlGroup}>
          <label className={classes.editTaskForm__label} htmlFor="description">
            Description
          </label>
          <TextAreaInput
            defaultValue={task.description}
            className={`${classes.editTaskForm__controlGroupInput} ${classes.editTaskForm__descriptionInput}`}
            placeholder="your task description here"
            id="description"
            cols="50"
            inputRef={taskDescriptionRef}
          />
        </div>

        {!isLoading && (
          <button
            className={classes.editTaskForm__submitButton}
            onClick={onSubmitButtonClick}
          >
            Save
          </button>
        )}
        {isLoading && <Loading className={classes.editTaskForm__loading} />}
      </form>
    </Modal>
  );
};

export default EditTaskForm;
