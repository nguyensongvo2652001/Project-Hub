import classes from "./EditMemberForm.module.css";

import Modal from "../UI/Modal/Modal.js";
import Tag from "../UI/Tag/Tag";
import Dropdown from "../UI/Dropdown/Dropdown";
import avatar from "../../assets/avatar1.jpg";
import ConstantContext from "../../contexts/ConstantContext";
import { useContext, useState } from "react";
import AvatarLink from "../AvatarLink/AvatarLink";
import ConfirmModal from "../ConfirmationModal/ConfirmModal";

const EditMemberForm = (props) => {
  const { member, closeForm } = props;

  const constantContext = useContext(ConstantContext);

  const [showRemoveMemberConfirmModal, setShowRemoveMemberConfirmModal] =
    useState(false);

  const closeRemoveMemberConfirmModal = () => {
    setShowRemoveMemberConfirmModal(false);
  };

  const openRemoveMemberConfirmModal = () => {
    setShowRemoveMemberConfirmModal(true);
  };

  const removeMember = () => {
    console.log(member.membershipId);
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
        <p className={classes.editMemberForm__memberName}>{member.name}</p>
        <button className={classes.editMemberForm__saveButton}>Save</button>
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

      <div className={classes.editMemberForm__memberRoleSelect}>
        <label>Role</label>
        <Dropdown
          className={classes.editMemberForm__memberRoleDropdown}
          options={constantContext.MEMBER_ROLES}
          defaultOption={member.role}
        />
      </div>

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
