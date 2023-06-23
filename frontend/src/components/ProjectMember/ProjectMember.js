import MyLink from "../MyLink/MyLink";
import Card from "../UI/Card/Card";
import CardMetaInfo from "../UI/CardMetaInfo/CardMetaInfo";
import Tag from "../UI/Tag/Tag";
import AvatarLink from "../AvatarLink/AvatarLink.js";

import classes from "./ProjectMember.module.css";
import { useState } from "react";
import EditMemberForm from "../EditMemberForm/EditMemberForm";

const ProjectMember = (props) => {
  const { member, memberMetaInfo, lastProjectMemberRef } = props;

  const [showEditMemberForm, setShowEditMemberForm] = useState(false);

  const closeEditMemberForm = () => {
    setShowEditMemberForm(false);
  };

  const openEditMemberForm = () => {
    setShowEditMemberForm(true);
  };

  let displayMemberName = member.name;
  if (displayMemberName.length > 20) {
    displayMemberName = displayMemberName.slice(0, 17) + "...";
  }

  let displayTag = member.role;
  if (member.status === "pending") {
    displayTag = "pending";
  }

  return (
    <li ref={lastProjectMemberRef}>
      {showEditMemberForm && (
        <EditMemberForm closeForm={closeEditMemberForm} member={member} />
      )}

      <Card className={classes.member}>
        <header className={classes.member__header}>
          <MyLink
            className={classes.member__name}
            text={displayMemberName}
            link={`/users/${member._id}`}
          />

          <Tag tag={displayTag} />
        </header>
        <AvatarLink
          src={member.avatar}
          alt="member avatar"
          className={classes.member__avatar}
          id={member._id}
        />
        <CardMetaInfo
          metaInfoList={memberMetaInfo}
          className={classes.member__metaInfoContainer}
        />

        <button
          className={classes.member__editButton}
          onClick={openEditMemberForm}
        >
          Edit
        </button>
      </Card>
    </li>
  );
};

export default ProjectMember;
