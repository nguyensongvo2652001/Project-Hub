import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./NotificationContainer.module.css";

const NotificationContainer = ({ errorMessage }) => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      className={classes.notificationContainer}
    />
  );
};

export default NotificationContainer;
