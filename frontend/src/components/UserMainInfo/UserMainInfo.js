import MyLink from "../MyLink/MyLink";
import Card from "../UI/Card/Card";
import AvatarLink from "../AvatarLink/AvatarLink.js";

import classes from "./UserMainInfo.module.css";

const UserMainInfo = (props) => {
  const { user, lastUserRef } = props;

  let displayUserName = user.name;
  if (displayUserName.length > 20) {
    displayUserName = displayUserName.slice(0, 17) + "...";
  }

  return (
    <li ref={lastUserRef}>
      <Card className={classes.user}>
        <header className={classes.user__header}>
          <MyLink
            className={classes.user__name}
            text={displayUserName}
            link={`/users/${user._id}`}
          />
          <p className={classes.user__jobTitle}>{user.jobTitle}</p>
        </header>

        <AvatarLink
          src={user.avatar}
          alt="user avatar"
          className={classes.user__avatar}
          id={user._id}
        />
      </Card>
    </li>
  );
};

export default UserMainInfo;
