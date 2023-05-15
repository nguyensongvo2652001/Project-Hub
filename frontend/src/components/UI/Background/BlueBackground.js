import styles from "./BlueBackground.module.css";

const BlueBackground = (props) => {
  console.log(props.className);
  const allClassesName = `${styles["background--blue"]} ${props.className}`;
  console.log(allClassesName);
  return <div className={allClassesName}>{props.children}</div>;
};

export default BlueBackground;
