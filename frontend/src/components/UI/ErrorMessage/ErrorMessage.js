import React from "react";
import styles from "./ErrorMessage.module.css"; // Import the CSS module styles

const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.error}>
      <ion-icon name="close-outline"></ion-icon>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
