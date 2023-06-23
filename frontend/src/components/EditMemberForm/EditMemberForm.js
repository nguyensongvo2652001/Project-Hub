import classes from "./EditMemberForm.module.css";

import Modal from "../UI/Modal/Modal.js";
import Tag from "../UI/Tag/Tag";
import Dropdown from "../UI/Dropdown/Dropdown";
import avatar from "../../assets/avatar1.jpg";
import ConstantContext from "../../contexts/ConstantContext";
import { useContext } from "react";
import AvatarLink from "../AvatarLink/AvatarLink";

const EditMemberForm = (props) => {
  const { member, closeForm } = props;
  console.log(member);

  const constantContext = useContext(ConstantContext);

  return (
    <Modal className={classes.editMemberForm} onClick={props.closeForm}>
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

      <button className={classes.editMemberForm__deleteMemberButton}>
        Remove this member
      </button>
    </Modal>
  );
};

export default EditMemberForm;
