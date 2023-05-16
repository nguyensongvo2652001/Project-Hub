import React, { forwardRef } from "react";
import ReactDOM from "react-dom";

import Card from "../Card/Card";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick} />;
};

const ModalOverlay = (props) => {
  const allClasses = `${classes.modal} ${props.className}`;
  return <Card className={allClasses}>{props.children}</Card>;
};

const Modal = forwardRef((props, ref) => {
  const backdrop = ReactDOM.createPortal(
    <Backdrop onClick={props.onClick} />,
    document.getElementById("backdrop-root")
  );
  const modalOverlay = ReactDOM.createPortal(
    <ModalOverlay className={props.className}>{props.children} </ModalOverlay>,
    document.getElementById("overlay-root")
  );

  return (
    <>
      {backdrop}
      {modalOverlay}
    </>
  );
});

export default Modal;
