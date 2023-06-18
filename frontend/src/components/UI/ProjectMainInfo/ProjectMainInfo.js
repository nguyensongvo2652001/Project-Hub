import CardMainInfo from "../CardMainInfo/CardMainInfo";

const ProjectMainInfo = (props) => {
  const { project } = props;
  let link = props.link || `/projects/${project._id}`;

  const mainInfo = {
    name: project.name,
    tag: project.tag,
    description: project.description,
    link,
  };

  return <CardMainInfo mainInfo={mainInfo} />;
};

export default ProjectMainInfo;
