import classes from "./EditMemberForm.module.css";

import Modal from "../UI/Modal/Modal.js";
import Tag from "../UI/Tag/Tag";
import Dropdown from "../UI/Dropdown/Dropdown";
import ConstantContext from "../../contexts/ConstantContext";
import { useContext, useRef, useState } from "react";
import AvatarLink from "../AvatarLink/AvatarLink";
import ConfirmModal from "../ConfirmationModal/ConfirmModal";
import useErrorHandling from "../../hooks/useErrorHandling";
import useSendRequest from "../../hooks/useSendRequest";
import { useNavigate } from "react-router-dom";
import Loading from "../UI/Loading/Loading";
import { successAlert } from "../../utils/alert";

const EditMemberForm = (props) => {
  const { member, closeForm } = props;

  let displayName = member.name;
  if (displayName.length > 10) {
    displayName = displayName.slice(0, 7) + "...";
  }

  const handleError = useErrorHandling();
  const { sendRequest } = useSendRequest();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const roleDropdownRef = useRef();

  const onSaveButtonClick = async () => {
    const editMemberRoleURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/projectMember/${member.membershipId}`;
    setIsSaving(true);
    try {
      const data = {
        role: roleDropdownRef.current.value,
      };
      const response = await sendRequest(editMemberRoleURL, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      successAlert("Update role successfully");
      setIsSaving(false);

      //reload the page after 1 second
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (err) {
      handleError(err);
    }
    setIsSaving(false);
  };

  const constantContext = useContext(ConstantContext);

  const [showRemoveMemberConfirmModal, setShowRemoveMemberConfirmModal] =
    useState(false);

  const closeRemoveMemberConfirmModal = () => {
    setShowRemoveMemberConfirmModal(false);
  };

  const openRemoveMemberConfirmModal = () => {
    setShowRemoveMemberConfirmModal(true);
  };

  const removeMember = async () => {
    const removeMemberURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/projectMember/${member.membershipId}`;
    const response = await sendRequest(removeMemberURL, {
      method: "DELETE",
    });
    if (response.status !== "success") {
      throw new Error(response.message);
    }

    successAlert("Remove member from project successfully");
    setTimeout(() => {
      navigate(0);
    }, 1500);
  };

  return (
    <Modal className={classes.editMemberForm} onClick={closeForm}>
      {showRemoveMemberConfirmModal && (
        <ConfirmModal
          closeModal={closeRemoveMemberConfirmModal}
          question={`Are you sure you want to remove ${member.name} from the project ?`}
          onConfirm={removeMember}
        />
      )}

      <header className={classes.editMemberForm__header}>
        <p className={classes.editMemberForm__memberName}>{displayName}</p>
        {!isSaving && member.status === "done" && (
          <button
            className={classes.editMemberForm__saveButton}
            onClick={onSaveButtonClick}
          >
            Save
          </button>
        )}
        {isSaving && <Loading />}
      </header>

      <Tag
        tag={member.role}
        className={classes.editMemberForm__memberRoleTag}
      />

      <div className={classes.editMemberForm__avatarContainer}>
        <AvatarLink
          src={member.avatar}
          alt="user's avatar"
          id={member.id}
          className={classes.editMemberForm__avatar}
        />
      </div>

      {member.status === "done" && (
        <div className={classes.editMemberForm__memberRoleSelect}>
          <label>Role</label>
          <Dropdown
            className={classes.editMemberForm__memberRoleDropdown}
            options={constantContext.MEMBER_ROLES}
            defaultOption={member.role}
            inputRef={roleDropdownRef}
          />
        </div>
      )}

      <button
        className={classes.editMemberForm__deleteMemberButton}
        onClick={openRemoveMemberConfirmModal}
      >
        Remove this member
      </button>
    </Modal>
  );
};

export default EditMemberForm;
