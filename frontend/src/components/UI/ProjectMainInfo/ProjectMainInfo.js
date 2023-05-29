import CardMainInfo from "../CardMainInfo/CardMainInfo";

const ProjectMainInfo = (props) => {
  const { project } = props;
  const mainInfo = {
    name: project.name,
    tag: project.tag,
    description: project.description,
    link: `/projects/${project._id}`,
  };

  return <CardMainInfo mainInfo={mainInfo} />;
};

export default ProjectMainInfo;
