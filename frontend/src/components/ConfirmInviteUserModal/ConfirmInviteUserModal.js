import Modal from "../UI/Modal/Modal";
import classes from "./ConfirmInviteUserModal.module.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import Loading from "../UI/Loading/Loading";

const ConfirmInviteUserModal = (props) => {
  const { project, user } = props;

  const [isLoading, setIsLoading] = useState(false);

  const inviteUser = () => {
    console.log("invited !");
    setIsLoading(true);
  };

  return (
    <Modal
      onClick={props.onClick}
      className={classes.confirmInviteUserModal}
      backdropClassName={classes.confirmInviteUserModal__backdrop}
    >
      <img
        src={logo}
        alt="ProjectHub logo"
        className={classes.confirmInviteUserModal__logo}
      />
      <p className={classes.confirmInviteUserModal__question}>
        Are you sure you want to invite {user?.name} to {project?.name} ?
      </p>
      {isLoading && (
        <Loading className={classes.confirmInviteUserModal__loading} />
      )}
      {!isLoading && (
        <div className={classes.confirmInviteUserModal__buttons}>
          <button
            className={classes.confirmInviteUserModal__confirmButton}
            onClick={inviteUser}
          >
            Confirm
          </button>
          <button
            className={classes.confirmInviteUserModal__cancelButton}
            onClick={props.onClick}
          >
            Cancel
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ConfirmInviteUserModal;
