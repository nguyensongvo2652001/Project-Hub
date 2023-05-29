import MyLink from "../../MyLink/MyLink";
import Tag from "../Tag/Tag.js";
import classes from "./CardMainInfo.module.css";

const CardMainInfo = (props) => {
  const { mainInfo } = props;

  let descriptionDisplay = mainInfo.description || "";
  if (descriptionDisplay.length > 120) {
    descriptionDisplay = descriptionDisplay.slice(0, 117) + "...";
  }

  let nameDisplay = mainInfo.name || "";
  if (nameDisplay.length > 22) {
    nameDisplay = nameDisplay.slice(0, 19) + "...";
  }

  return (
    <div className={classes.mainInfo}>
      <MyLink text={nameDisplay} link={mainInfo.link} />
      <Tag tag={mainInfo.tag} />

      <p className={classes.mainInfo__description}>{descriptionDisplay}</p>
    </div>
  );
};

export default CardMainInfo;
