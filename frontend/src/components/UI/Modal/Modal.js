import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import Card from "../Card/Card";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick} />;
};

const ModalOverlay = (props) => {
  return <Card className={classes.modal}>{props.children}</Card>;
};

const Modal = forwardRef((props, ref) => {
  const [showModal, setShowModal] = useState(true);

  const toggleShowModal = () => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  useImperativeHandle(ref, () => ({
    toggleShowModal,
  }));

  const backdrop = ReactDOM.createPortal(
    <Backdrop onClick={toggleShowModal} />,
    document.getElementById("backdrop-root")
  );
  const modalOverlay = ReactDOM.createPortal(
    <ModalOverlay>{props.children} </ModalOverlay>,
    document.getElementById("overlay-root")
  );

  return (
    <>
      {showModal && backdrop}
      {showModal && modalOverlay}
    </>
  );
});

export default Modal;
