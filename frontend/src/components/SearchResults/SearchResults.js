import { useLocation } from "react-router-dom";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { useState } from "react";
import ProjectMainInfo from "../UI/ProjectMainInfo/ProjectMainInfo";
import AuthPageLayout from "../Layout/AuthPageLayout/AuthPageLayout";
import SearchBarContainer from "../SearchBar/SearchBarContainer";

import classes from "./SearchResults.module.css";
import Card from "../UI/Card/Card";
import UserMainInfo from "../UserMainInfo/UserMainInfo";
import avatar from "../../assets/avatar1.jpg";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get("q");

  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const [showProjects, setShowProjects] = useState(true);

  const fakeProject = {
    id: "123",
    tag: "Other",
    name: "Lorem ipsum",
    description: "Lorem ipsum ",
  };

  const fakeUser = {
    id: "123",
    name: "Uzumaki Naruto",
    jobTitle: "Hokage of Leaf Village",
    avatar: avatar,
  };

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.searchResultsContainer}>
        <h1 className={classes.searchResultsTitle}>Search Results</h1>
        <ul className={classes.searchResultsTabs}>
          <li
            className={`${classes.searchResultsTab} ${classes["searchResultsTab--active"]}`}
          >
            <p>Projects</p>
          </li>
          <li className={`${classes.searchResultsTab}`}>
            <p>Users</p>
          </li>
        </ul>

        {/* <ul className={classes.searchResults__projects}>
          <li className={classes.searchResults__project}>
            <Card className={classes.searchResults__projectCard}>
              <ProjectMainInfo
                project={fakeProject}
                link={`/projects/123/publicDetail`}
              />
            </Card>
          </li>

          <li className={classes.searchResults__project}>
            <Card className={classes.searchResults__projectCard}>
              <ProjectMainInfo
                project={fakeProject}
                link={`/projects/123/publicDetail`}
              />
            </Card>
          </li>

          <li className={classes.searchResults__project}>
            <Card className={classes.searchResults__projectCard}>
              <ProjectMainInfo
                project={fakeProject}
                link={`/projects/123/publicDetail`}
              />
            </Card>
          </li>
        </ul> */}

        <ul className={classes.searchResults__users}>
          <li className={classes.searchResults__user}>
            <UserMainInfo user={fakeUser} />
          </li>

          <li className={classes.searchResults__user}>
            <UserMainInfo user={fakeUser} />
          </li>

          <li className={classes.searchResults__user}>
            <UserMainInfo user={fakeUser} />
          </li>
        </ul>
      </div>
    </AuthPageLayout>
  );
};

export default SearchResults;
