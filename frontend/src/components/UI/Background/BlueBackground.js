import styles from "./BlueBackground.module.css";

const BlueBackground = (props) => {
  const allClassesName = `${styles["background--blue"]} ${props.className}`;
  return <div className={allClassesName}>{props.children}</div>;
};

export default BlueBackground;
