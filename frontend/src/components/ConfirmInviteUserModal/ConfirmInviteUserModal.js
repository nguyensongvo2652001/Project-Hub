import useSendRequest from "../../hooks/useSendRequest";

import { successAlert } from "../../utils/alert.js";
import ConfirmModal from "../ConfirmationModal/ConfirmModal";

const ConfirmInviteUserModal = (props) => {
  const { project, user } = props;
  const closeCurrentModal = props.onClick;

  const { sendRequest } = useSendRequest();

  const inviteUser = async () => {
    const inviteMemberURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/projectMember/inviteMember`;
    const data = {
      projectId: project._id,
      email: user.email,
    };

    const response = await sendRequest(inviteMemberURL, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.status !== "success") {
      throw new Error(response.message);
    }

    successAlert(response.message);
  };

  return (
    <ConfirmModal
      onConfirm={inviteUser}
      closeModal={closeCurrentModal}
      question={`Are you sure you want to invite ${user.name} to project ${project.name} ?`}
    />
  );
};

export default ConfirmInviteUserModal;
