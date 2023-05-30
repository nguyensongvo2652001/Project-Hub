import MyLink from "../MyLink/MyLink";
import Card from "../UI/Card/Card";
import CardMetaInfo from "../UI/CardMetaInfo/CardMetaInfo";
import Tag from "../UI/Tag/Tag";
import classes from "./ProjectMember.module.css";

const ProjectMember = (props) => {
  const { member, memberMetaInfo } = props;

  let displayMemberName = member.name;
  if (displayMemberName.length > 20) {
    displayMemberName = displayMemberName.slice(0, 17) + "...";
  }

  return (
    <li>
      <Card className={classes.member}>
        <header className={classes.member__header}>
          <MyLink
            className={classes.member__name}
            text={displayMemberName}
            link={`/users/${member._id}`}
          />

          <Tag tag={member.role} />
        </header>

        <img
          src={member.avatar}
          alt="member avatar"
          className={classes.member__avatar}
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
