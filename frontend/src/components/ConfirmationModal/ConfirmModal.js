import Modal from "../UI/Modal/Modal";
import classes from "./ConfirmModal.module.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import Loading from "../UI/Loading/Loading";
import useErrorHandling from "../../hooks/useErrorHandling";

const ConfirmModal = (props) => {
  const { onConfirm, closeModal, question } = props;

  const [isLoading, setIsLoading] = useState(false);
  const handleError = useErrorHandling();

  const onConfirmButtonClick = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsLoading(false);
      closeModal();
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      onClick={closeModal}
      className={classes.confirmModal}
      backdropClassName={classes.confirmModal__backdrop}
    >
      <img
        src={logo}
        alt="ProjectHub logo"
        className={classes.confirmModal__logo}
      />
      <p className={classes.confirmModal__question}>{question}</p>
      {isLoading && <Loading className={classes.confirmModal__loading} />}
      {!isLoading && (
        <div className={classes.confirmModal__buttons}>
          <button
            className={classes.confirmModal__confirmButton}
            onClick={onConfirmButtonClick}
          >
            Confirm
          </button>
          <button
            className={classes.confirmModal__cancelButton}
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ConfirmModal;
