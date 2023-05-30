import classes from "./Card.module.css";

const Card = (props) => {
  let allClassesName = ` `;
  if (props.noHoverStyle) {
    allClassesName += classes["card--noHover"];
  } else allClassesName += classes.card;

  allClassesName += ` ${props.className}`;

  return <div className={allClassesName}>{props.children}</div>;
};

export default Card;
