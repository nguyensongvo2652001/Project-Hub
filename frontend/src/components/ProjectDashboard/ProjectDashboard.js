import ConstantContext from "../../contexts/ConstantContext.js";
import Task from "../Task/Task.js";
import Loading from "../UI/Loading/Loading.js";
import NoDocumentsFound from "../UI/NoDocumentsFound/NoDocumentsFound.js";
import InProjectWithHeaderAndStatRowLayout from "../Layout/InProjectWithHeaderAndStatRowLayout/InProjectWithHeaderAndStatRowLayout.js";

import { useCallback, useContext, useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest.js";
import useErrorHandling from "../../hooks/useErrorHandling.js";
import useIntersectionObserver from "../../hooks/useIntersectionObserver.js";

import classes from "./ProjectDashboard.module.css";

import { capitalizeFirstLetter } from "../../utils/string";

import { getDateDisplay } from "../../utils/date.js";

const ProjectDashboard = (props) => {
  const { project } = props;
  const getMoreTasksLimitPerRequest = 10;

  const [taskStatus, setTaskStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [getMoreTasksPage, setGetMoreTasksPage] = useState(1);
  const [noMoreTasks, setNoMoreTasks] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const { sendRequest } = useSendRequest();
  const [lastTaskRef, setLastTaskRef] = useState(null);
  const handleError = useErrorHandling();

  const onDropdownOptionChange = (event) => {
    if (event.target.value === taskStatus) return;

    setTaskStatus(event.target.value);
    setTasks([]);
    setNoMoreTasks(false);
    setGetMoreTasksPage(1);
  };

  const shouldStopObservingLastTaskRef = useCallback(() => {
    return noMoreTasks;
  }, [noMoreTasks]);

  const actionWhenLastTaskRefInViewport = useCallback(() => {
    setGetMoreTasksPage((prev) => prev + 1);
  }, []);

  useIntersectionObserver(
    shouldStopObservingLastTaskRef,
    lastTaskRef,
    actionWhenLastTaskRefInViewport
  );

  const tasksCountBasedOnStatus = {
    open: 0,
    doing: 0,
    closed: 0,
    testing: 0,
    overdue: 0,
  };

  const { tasksCount } = project;
  tasksCount.map((taskCountInfo) => {
    const status = taskCountInfo._id;
    tasksCountBasedOnStatus[status] = taskCountInfo.count;
    return null;
  });

  const tasksStatRowOptions = Object.keys(tasksCountBasedOnStatus).map(
    (key) => {
      return { label: key, value: tasksCountBasedOnStatus[key] };
    }
  );

  useEffect(() => {
    const getMoreTasks = async () => {
      console.log(getMoreTasksPage);
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      if (noMoreTasks) {
        return;
      }

      let getTasksURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/task?limit=${getMoreTasksLimitPerRequest}&page=${getMoreTasksPage}`;

      if (taskStatus !== "All") {
        getTasksURL += `&status=${taskStatus.toLowerCase()}`;
      }

      setIsLoading(true);
      const response = await sendRequest(getTasksURL);

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const moreTasks = response.data.tasks;

      if (moreTasks.length === 0) {
        setNoMoreTasks(true);
      }

      setTasks((prev) => [...prev, ...moreTasks]);

      setIsLoading(false);

      try {
      } catch (err) {
        handleError(err);
      }
    };

    getMoreTasks();
  }, [
    getMoreTasksPage,
    handleError,
    isInitialRender,
    project._id,
    sendRequest,
    taskStatus,
    noMoreTasks,
  ]);

  const constantContext = useContext(ConstantContext);

  const taskStatusOptions = constantContext.TASK_STATUS_CONSTANT;
  const statusDropdownOptions = [
    "All",
    ...taskStatusOptions.map((status) => capitalizeFirstLetter(status)),
  ];

  return (
    <InProjectWithHeaderAndStatRowLayout
      dropDownOptions={statusDropdownOptions}
      dropDownOnChange={onDropdownOptionChange}
      project={project}
      shouldDisplayNewTaskButton={true}
      statRowOptions={tasksStatRowOptions}
    >
      {tasks.length > 0 && (
        <ul className={classes.projectDashboard__tasks}>
          {tasks.map((task, index) => {
            const taskDisplayMetaInfo = [
              {
                title: "Start date: ",
                value: task.startDate
                  ? getDateDisplay(task.startDate)
                  : "Not defined yet",
              },
              {
                title: "Deadline: ",
                value: task.startDate
                  ? getDateDisplay(task.deadline)
                  : "Not defined yet",
              },
            ];

            if (index === tasks.length - 1) {
              return (
                <Task
                  key={index}
                  task={task}
                  taskDisplayMetaInfo={taskDisplayMetaInfo}
                  className={classes.projectDashboard__task}
                  taskRef={setLastTaskRef}
                />
              );
            }

            return (
              <Task
                key={index}
                task={task}
                taskDisplayMetaInfo={taskDisplayMetaInfo}
                className={classes.projectDashboard__task}
              />
            );
          })}
        </ul>
      )}
      {isLoading && <Loading />}
      {!isLoading && (
        <NoDocumentsFound message="Unfortunately, it looks like we can not find any other tasks" />
      )}
    </InProjectWithHeaderAndStatRowLayout>
  );
};

export default ProjectDashboard;
