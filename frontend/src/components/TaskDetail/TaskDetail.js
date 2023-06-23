import { useNavigate, useParams } from "react-router-dom";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { useEffect, useState } from "react";
import { getDateDisplay } from "../../utils/date.js";

import classes from "./TaskDetail.module.css";

import Loading from "../UI/Loading/Loading";
import Tag from "../UI/Tag/Tag";
import AvatarLink from "../AvatarLink/AvatarLink";
import ChosenDevelopersRow from "../ChosenDevelopersRow/ChosenDevelopersRow";
import EditTaskForm from "../EditTaskForm/EditTaskForm";
import ConfirmModal from "../ConfirmationModal/ConfirmModal";
import { successAlert } from "../../utils/alert";

const TaskDetail = (props) => {
  const { project } = props;

  const params = useParams();
  const { taskId } = params;
  const navigate = useNavigate();
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();
  const [isLoading, setIsLoading] = useState(true);
  const [task, setTask] = useState({});
  const [taskDevelopers, setTaskDevelopers] = useState(task?.developers);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [showDeleteTaskConfirmationModal, setShowDeleteTaskConfirmationModal] =
    useState(false);

  useEffect(() => {
    const getTaskDetail = async () => {
      setIsLoading(true);
      try {
        const getTaskDetailURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/task/${taskId}`;

        const response = await sendRequest(getTaskDetailURL);

        if (response.statusCode !== 200) {
          return navigate("/forbidden");
        }

        const { task } = response.data;

        setTask(task);
      } catch (err) {
        handleError(err);
      }

      setIsLoading(false);
    };

    getTaskDetail();
  }, [handleError, navigate, sendRequest, taskId]);

  const closeEditTaskForm = () => {
    setShowEditTaskForm(false);
  };

  const openEditTaskForm = () => {
    setShowEditTaskForm(true);
  };

  const closeDeleteTaskConfirmationModal = () => {
    setShowDeleteTaskConfirmationModal(false);
  };

  const openDeleteTaskConfirmationModal = () => {
    setShowDeleteTaskConfirmationModal(true);
  };

  const deleteTask = async () => {
    const deleteTaskURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/task/${task._id}`;
    const response = await sendRequest(deleteTaskURL, { method: "DELETE" });

    if (response.status !== "success") {
      throw new Error(response.message);
    }

    successAlert("Delete task successfully");

    setTimeout(() => {
      navigate(`/projects/${project._id}`);
    }, 1500);
  };

  return (
    <>
      {showEditTaskForm && (
        <EditTaskForm
          closeEditTaskForm={closeEditTaskForm}
          task={task}
          setTask={setTask}
          project={project}
        />
      )}
      {showDeleteTaskConfirmationModal && (
        <ConfirmModal
          question={`Are you sure you want to delete ${task.name} task ?`}
          closeModal={closeDeleteTaskConfirmationModal}
          onConfirm={deleteTask}
        />
      )}
      {isLoading && <Loading />}
      {!isLoading && (
        <div className={classes.taskDetailContainer}>
          <header className={classes.taskDetail__header}>
            <h1 className={classes.taskDetail__name}>{task.name}</h1>
            <button
              className={classes.taskDetail__editButton}
              onClick={openEditTaskForm}
            >
              Edit
            </button>
            <button
              className={classes.taskDetail__deleteButton}
              onClick={openDeleteTaskConfirmationModal}
            >
              Delete
            </button>
          </header>

          <ul className={classes.taskDetail__taskInfoContainer}>
            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>ID</label>
              <p
                className={`${classes.taskDetail__value} ${classes.taskDetail__idValue}`}
              >
                {task._id}
              </p>
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Status</label>
              <Tag
                tag={task.status}
                className={`${classes.taskDetail__value} ${classes.taskDetail__statusTag}`}
              />
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Creator</label>
              <AvatarLink
                alt={`${task.creator.name}'s avatar`}
                src={task.creator.avatar}
                id={task.creator._id}
                className={`${classes.taskDetail__value} ${classes.taskDetail__creatorAvatar}`}
              />
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Developers</label>
              <ChosenDevelopersRow
                project={project}
                chosenDevelopers={task.developers}
                className={classes.taskDetail__value}
                allowedEdit={false}
              />
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Start date</label>
              <p className={classes.taskDetail__value}>
                {task.startDate
                  ? getDateDisplay(task.startDate)
                  : "Not defined yet"}
              </p>
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Deadline</label>
              <p className={classes.taskDetail__value}>
                {task.deadline
                  ? getDateDisplay(task.deadline)
                  : "Not defined yet"}
              </p>
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Finish date</label>
              <p className={classes.taskDetail__value}>
                {task.finishDate
                  ? getDateDisplay(task.finishDate)
                  : "Not defined yet"}
              </p>
            </li>

            <li className={classes.taskDetail__info}>
              <label className={classes.taskDetail__label}>Description</label>
              <p className={classes.taskDetail__value}>
                {task.description || "Not defined yet"}
              </p>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default TaskDetail;
