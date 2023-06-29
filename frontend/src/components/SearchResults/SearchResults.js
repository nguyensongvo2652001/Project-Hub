import { useLocation } from "react-router-dom";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { useCallback, useEffect, useState } from "react";
import ProjectMainInfo from "../UI/ProjectMainInfo/ProjectMainInfo";
import AuthPageLayout from "../Layout/AuthPageLayout/AuthPageLayout";
import SearchBarContainer from "../SearchBar/SearchBarContainer";
import Loading from "../UI/Loading/Loading";
import NoDocumentsFound from "../UI/NoDocumentsFound/NoDocumentsFound";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

import classes from "./SearchResults.module.css";
import Card from "../UI/Card/Card";
import UserMainInfo from "../UserMainInfo/UserMainInfo";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentQuery = queryParams.get("q");

  const limitPerRequests = 10;

  const [isInitialRender, setIsInitialRender] = useState(true);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [noMoreProjects, setNoMoreProjects] = useState(false);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  // Initally, the projects result will be shown first so we will start at page 1 for the projects. Only when we switch to the users page that is when we update the currentUsersPage + 1
  const [currentProjectsPage, setCurrentProjectsPage] = useState(1);
  const [currentUsersPage, setCurrentUsersPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const [showProjects, setShowProjects] = useState(true);
  const [lastProjectRef, setLastProjectRef] = useState(undefined);
  const [lastUserRef, setLastUserRef] = useState(undefined);

  const actionWhenLastProjectRefInViewport = useCallback(() => {
    setCurrentProjectsPage((prev) => prev + 1);
  }, []);

  const actionWhenLastUserRefInViewport = useCallback(() => {
    setCurrentUsersPage((prev) => prev + 1);
  }, []);

  const stopObservingLastProjectRef = useCallback(() => {
    return noMoreProjects;
  }, [noMoreProjects]);

  const stopObservingLastUserRef = useCallback(() => {
    return noMoreUsers;
  }, [noMoreUsers]);

  useIntersectionObserver(
    stopObservingLastProjectRef,
    lastProjectRef,
    actionWhenLastProjectRefInViewport
  );

  useIntersectionObserver(
    stopObservingLastUserRef,
    lastUserRef,
    actionWhenLastUserRefInViewport
  );

  const classesForProjectTab = `${classes.searchResultsTab} ${
    showProjects ? classes["searchResultsTab--active"] : ""
  }`;
  const classesForUserTab = `${classes.searchResultsTab} ${
    !showProjects ? classes["searchResultsTab--active"] : ""
  }`;

  const switchToProjectsTab = () => {
    if (!showProjects) {
      setShowProjects(true);

      setCurrentProjectsPage((prev) => prev + 1);
    }
  };

  const switchToUsersTab = () => {
    if (showProjects) {
      setShowProjects(false);

      setCurrentUsersPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const getSearchResults = async () => {
      let getSearchResultsURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/search?q=${currentQuery}&limit=${limitPerRequests}&page=${currentProjectsPage}`;

      if (!showProjects) {
        getSearchResultsURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/user/search?q=${currentQuery}&limit=${limitPerRequests}&page=${currentUsersPage}`;
      }

      setIsLoading(true);
      try {
        const response = await sendRequest(getSearchResultsURL);
        if (response.status !== "success") {
          throw new Error(response.message);
        }

        if (showProjects) {
          const { projects, length } = response.data;
          if (length === 0) {
            setNoMoreProjects(true);
          }

          setDisplayedProjects((prev) => {
            const newDisplayedProjects = [...prev, ...projects];
            return newDisplayedProjects;
          });
        }

        if (!showProjects) {
          const { users, length } = response.data;
          if (length === 0) {
            setNoMoreUsers(true);
          }

          setDisplayedUsers((prev) => {
            const newDisplayedUsers = [...prev, ...users];
            return newDisplayedUsers;
          });
        }
      } catch (err) {
        handleError(err);
      }

      setIsLoading(false);
    };

    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    // If we are getting results for projects and there are still projects in the database
    if (showProjects && !noMoreProjects) {
      getSearchResults();
    }

    // If we are getting results for users and there are still users in the database
    if (!showProjects && !noMoreUsers) {
      getSearchResults();
    }
  }, [
    currentProjectsPage,
    currentQuery,
    currentUsersPage,
    handleError,
    isInitialRender,
    noMoreProjects,
    noMoreUsers,
    sendRequest,
    showProjects,
  ]);

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.searchResultsContainer}>
        <h1 className={classes.searchResultsTitle}>Search Results</h1>
        <ul className={classes.searchResultsTabs}>
          <li className={classesForProjectTab} onClick={switchToProjectsTab}>
            <p>Projects</p>
          </li>
          <li className={classesForUserTab} onClick={switchToUsersTab}>
            <p>Users</p>
          </li>
        </ul>

        {showProjects && (
          <ul className={classes.searchResults__projects}>
            {displayedProjects.map((project, index) => {
              let tempLastProjetRef;
              if (index === displayedProjects.length - 1) {
                tempLastProjetRef = setLastProjectRef;
              }

              return (
                <li
                  className={classes.searchResults__project}
                  ref={tempLastProjetRef}
                  key={project._id}
                >
                  <Card className={classes.searchResults__projectCard}>
                    <ProjectMainInfo
                      project={project}
                      link={`/projects/${project._id}/publicDetail`}
                    />
                  </Card>
                </li>
              );
            })}

            {isLoading && <Loading />}
          </ul>
        )}

        {!showProjects && (
          <ul className={classes.searchResults__users}>
            {displayedUsers.map((user, index) => {
              let tempLastUserRef;
              if (index === displayedUsers.length - 1) {
                tempLastUserRef = setLastUserRef;
              }

              return (
                <li
                  className={classes.searchResults__user}
                  ref={tempLastUserRef}
                  key={user._id}
                >
                  <UserMainInfo user={user} />
                </li>
              );
            })}

            {isLoading && <Loading />}
          </ul>
        )}

        {!isLoading && (
          <NoDocumentsFound
            message="Can't find anything else."
            className={classes.noDocumentsFound}
          />
        )}
      </div>
    </AuthPageLayout>
  );
};

export default SearchResults;
