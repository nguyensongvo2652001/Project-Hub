import { useState } from "react";
import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";

import classes from "./ProjectsPage.module.css";
import NoDocumentsFound from "../../components/UI/NoDocumentsFound/NoDocumentsFound";
import Project from "../../components/Project/Project";

const ProjectsPage = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const twitterCloneProject = {
    name: "Twitter Clone",
    tag: "Website",
    description:
      "A twitter clone project for educational purpose. A twitter clone project for educational purpose. A twitter clone project for educational purpose. A twitter clone project for educational purpose.",
    lastChange: "15/01/2023",
    createdAt: "10/01/2023",
  };

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.projectsPage}>
        <ul className={classes.projectsPage__projects}>
          <div className={classes.projectsPage__createProjectSection}>
            <p className={classes.projectsPage__createProjectText}>
              Add a new project here
            </p>
            <button className={classes.projectsPage__createProjectButton}>
              Click here to create a new project
            </button>
          </div>
          <Project project={twitterCloneProject} />
        </ul>
        {!isLoading && (
          <NoDocumentsFound message="Unfortunately, it looks like we can not find any other projects" />
        )}
      </div>
    </AuthPageLayout>
  );
};

export default ProjectsPage;
