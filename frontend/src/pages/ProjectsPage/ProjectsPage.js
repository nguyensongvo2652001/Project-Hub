import { useCallback, useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import Loading from "../../components/UI/Loading/Loading";
import NoDocumentsFound from "../../components/UI/NoDocumentsFound/NoDocumentsFound";
import Project from "../../components/Project/Project";

import classes from "./ProjectsPage.module.css";
import ProjectList from "../../components/ProjectList/ProjectList";
import Modal from "../../components/UI/Modal/Modal";
import NewProjectForm from "../../components/NewProjectForm/NewProjectForm";

const ProjectsPage = (props) => {
  const maxProjectsPerResponse = 10;
  const [pageForGettingProjects, setPageForGettingProjects] = useState(1);
  const [noMoreProjects, setNoMoreProjects] = useState(false);
  const [lastProjectElement, setLastProjectElement] = useState(undefined);
  const [isInitialRender, setIsIntialRender] = useState(true);
  const [projects, setProjects] = useState([]);

  const handleError = useErrorHandling();

  const { sendRequest } = useSendRequest();

  const [isLoading, setIsLoading] = useState(false);

  const setPageWhenLastProjectInViewport = useCallback(() => {
    setPageForGettingProjects((prev) => prev + 1);
  }, []);

  const checkIfThereAreNoMoreProjects = useCallback(() => {
    return noMoreProjects;
  }, [noMoreProjects]);

  useIntersectionObserver(
    checkIfThereAreNoMoreProjects,
    lastProjectElement,
    setPageWhenLastProjectInViewport
  );

  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const toggleShowNewProjectForm = () => {
    setShowNewProjectForm((prev) => !prev);
  };

  const createProject = async (data) => {
    const createProjectURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project`;
    try {
      const response = await sendRequest(createProjectURL, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.status !== "success") {
        const errorMessage = response.message;
        throw new Error(errorMessage);
      }

      if (response.status === "success") {
        toggleShowNewProjectForm();
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    if (noMoreProjects) {
      return;
    }

    const getMoreProjects = async () => {
      if (isInitialRender) {
        setIsIntialRender(false);
        return;
      }

      try {
        const getJoinedProjectsURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/me/project?page=${pageForGettingProjects}&limit=${maxProjectsPerResponse}`;

        setIsLoading(true);
        const response = await sendRequest(getJoinedProjectsURL);
        setIsLoading(false);

        if (response.status !== "success") {
          throw Error(
            "something went wrong when trying to get your joined projects"
          );
        }

        const { data } = response;

        if (data.length === 0) {
          setNoMoreProjects(true);
        }

        const { projects } = data;

        setProjects((prev) => [...prev, ...projects]);
      } catch (err) {
        handleError(err);
      }
    };

    getMoreProjects();
  }, [
    noMoreProjects,
    handleError,
    sendRequest,
    isInitialRender,
    pageForGettingProjects,
  ]);

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.projectsPage}>
        <ul className={classes.projectsPage__projects}>
          <div className={classes.projectsPage__createProjectSection}>
            <p className={classes.projectsPage__createProjectText}>
              Add a new project here
            </p>
            <button
              className={classes.projectsPage__createProjectButton}
              onClick={toggleShowNewProjectForm}
            >
              Create a new project
            </button>
          </div>
          <ProjectList
            projects={projects}
            lastProjectElement={setLastProjectElement}
          />

          {isLoading && <Loading className={classes.projectPage__loading} />}
        </ul>

        {showNewProjectForm && (
          <Modal
            className={classes.projectPage__newProjectFormModal}
            onClick={toggleShowNewProjectForm}
          >
            <NewProjectForm onSubmit={createProject} />
          </Modal>
        )}

        {!isLoading && (
          <NoDocumentsFound message="Unfortunately, it looks like we can not find any other projects" />
        )}
      </div>
    </AuthPageLayout>
  );
};

export default ProjectsPage;
