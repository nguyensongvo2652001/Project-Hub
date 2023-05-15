import styles from "./Card.module.css";

const Card = (props) => {
  const allClassesName = `${styles.card} ${props.className}`;
  return <div className={allClassesName}>{props.children}</div>;
};

export default Card;
