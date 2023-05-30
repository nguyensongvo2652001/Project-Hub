import InProjectWithHeaderAndTaskStatRowLayout from "../Layout/InProjectWithHeaderAndTaskStatRowLayout/InProjectWithHeaderAndTaskStatRowLayout";

import classes from "./ProjectMembers.module.css";

import avatar from "../../assets/avatar1.jpg";

import ProjectMember from "../ProjectMember/ProjectMember";

const ProjectMembers = (props) => {
  const memberMetaInfo = [
    {
      title: "Date joined: ",
      value: "24/12/2022",
    },
    {
      title: "Total tasks: ",
      value: "85",
    },
    {
      title: "Completion rate: ",
      value: "75%",
    },
  ];

  const member = {
    name: "Jonathan Doe",
    role: "owner",
    avatar: avatar,
    _id: "123",
  };

  return (
    <InProjectWithHeaderAndTaskStatRowLayout>
      <ul className={classes.members}>
        <ProjectMember member={member} memberMetaInfo={memberMetaInfo} />
        <ProjectMember member={member} memberMetaInfo={memberMetaInfo} />
        <ProjectMember member={member} memberMetaInfo={memberMetaInfo} />
        <ProjectMember member={member} memberMetaInfo={memberMetaInfo} />
      </ul>
    </InProjectWithHeaderAndTaskStatRowLayout>
  );
};

export default ProjectMembers;
