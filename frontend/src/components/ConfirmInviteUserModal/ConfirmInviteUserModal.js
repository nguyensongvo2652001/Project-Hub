import Modal from "../UI/Modal/Modal";
import classes from "./ConfirmInviteUserModal.module.css";
import logo from "../../assets/logo.png";
import { useState } from "react";
import Loading from "../UI/Loading/Loading";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { successAlert } from "../../utils/alert.js";

const ConfirmInviteUserModal = (props) => {
  const { project, user } = props;
  const closeCurrentModal = props.onClick;

  const [isLoading, setIsLoading] = useState(false);
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const inviteUser = async () => {
    setIsLoading(true);
    const inviteMemberURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/projectMember/inviteMember`;
    const data = {
      projectId: project._id,
      email: user.email,
    };

    try {
      const response = await sendRequest(inviteMemberURL, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      successAlert(response.message);
      setIsLoading(false);
      closeCurrentModal();
    } catch (err) {
      handleError(err);
    }

    setIsLoading(false);
  };

  return (
    <Modal
      onClick={closeCurrentModal}
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
