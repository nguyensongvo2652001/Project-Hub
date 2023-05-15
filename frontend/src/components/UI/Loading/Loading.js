import React from "react";
import styles from "./Loading.module.css"; // Import the CSS file for styling

const Loading = (props) => {
  const allClasses = `${styles["loading-spinner"]} ${props.className}`;
  return <div className={allClasses}></div>;
};

export default Loading;
