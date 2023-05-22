import Project from "../Project/Project";

const ProjectList = (props) => {
  const { projects, lastProjectElement } = props;

  return (
    <>
      {projects.length > 0 &&
        projects.map((project, index) => {
          if (index === projects.length - 1) {
            return (
              <Project
                project={project}
                key={project._id}
                lastProjectElement={lastProjectElement}
              />
            );
          }
          return <Project project={project} key={project._id} />;
        })}
    </>
  );
};

export default ProjectList;
