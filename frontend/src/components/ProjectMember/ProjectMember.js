import MyLink from "../MyLink/MyLink";
import Card from "../UI/Card/Card";
import CardMetaInfo from "../UI/CardMetaInfo/CardMetaInfo";
import Tag from "../UI/Tag/Tag";
import AvatarLink from "../AvatarLink/AvatarLink.js";

import classes from "./ProjectMember.module.css";

const ProjectMember = (props) => {
  const { member, memberMetaInfo, lastProjectMemberRef } = props;

  let displayMemberName = member.name;
  if (displayMemberName.length > 20) {
    displayMemberName = displayMemberName.slice(0, 17) + "...";
  }

  return (
    <li ref={lastProjectMemberRef}>
      <Card className={classes.member}>
        <header className={classes.member__header}>
          <MyLink
            className={classes.member__name}
            text={displayMemberName}
            link={`/users/${member._id}`}
          />

          <Tag tag={member.role} />
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

        <button className={classes.member__editButton}>Edit</button>
      </Card>
    </li>
  );
};

export default ProjectMember;
