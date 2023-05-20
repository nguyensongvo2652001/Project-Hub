import React, { forwardRef } from "react";
import ReactDOM from "react-dom";

import Card from "../Card/Card";
import classes from "./Modal.module.css";

export const Backdrop = (props) => {
  const backdrop = ReactDOM.createPortal(
    <div className={classes.backdrop} onClick={props.onClick} />,
    document.getElementById("backdrop-root")
  );
  return backdrop;
};

const ModalOverlay = (props) => {
  const allClasses = `${classes.modal} ${props.className}`;
  return <Card className={allClasses}>{props.children}</Card>;
};

const Modal = forwardRef((props, ref) => {
  const backdrop = <Backdrop onClick={props.onClick} />;
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
