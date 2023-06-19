import Modal from "../UI/Modal/Modal.js";
import SearchBar from "../SearchBar/SearchBar.js";
import Loading from "../UI/Loading/Loading.js";

import { useState } from "react";
import useSendRequest from "../../hooks/useSendRequest.js";
import useErrorHandling from "../../hooks/useErrorHandling.js";

import debounce from "../../utils/debounce.js";

import classes from "./NewMemberModal.module.css";
import ConfirmInviteUserModal from "../ConfirmInviteUserModal/ConfirmInviteUserModal.js";

const NewMemberModal = (props) => {
  const { onClick, project } = props;

  const [displayDevelopers, setDisplayDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmInviteUserModal, setShowConfirmInviteUserModal] =
    useState(false);
  const [underReviewUser, setUnderReviewUser] = useState(undefined);

  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  //We only search for users that are NOT in the project to invite.
  const searchNonMembers = debounce(async (query) => {
    setIsLoading(true);
    try {
      const searchNonMembersURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/nonMember/search?q=${query}`;
      const response = await sendRequest(searchNonMembersURL);

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const { nonMembers } = response.data;
      setDisplayDevelopers(nonMembers);
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  }, 0.3);

  const onSearchInputChange = (event) => {
    searchNonMembers(event.target.value);
  };

  const openConfirmInviteUserModal = () => {
    setShowConfirmInviteUserModal(true);
  };

  const closeConfirmInviteUserModal = () => {
    setShowConfirmInviteUserModal(false);
  };

  const onConfirmInviteButtonClick = (user) => {
    setUnderReviewUser(user);
    openConfirmInviteUserModal();
  };

  return (
    <Modal
      onClick={onClick}
      className={classes.newMemberModal__modal}
      backdropClassName={classes.newMemberModal__backdrop}
    >
      {showConfirmInviteUserModal && (
        <ConfirmInviteUserModal
          onClick={closeConfirmInviteUserModal}
          user={underReviewUser}
          project={project}
        />
      )}
      <div className={classes.newMemberModal__content}>
        <h1 className={classes.newMemberModal__title}>Edit developers</h1>

        <SearchBar
          className={classes.newMemberModal__searchBar}
          onChange={onSearchInputChange}
        />

        <ul className={classes.newMemberModal__developersList}>
          {isLoading && <Loading />}
          {!isLoading && displayDevelopers.length === 0 && (
            <p className={classes.newMemberModal__noChosenDevelopers}>
              No developers found
            </p>
          )}
          {!isLoading &&
            displayDevelopers.map((developer) => {
              return (
                <li
                  className={classes.newMemberModal__developer}
                  key={developer._id}
                >
                  <div className={classes.newMemberModal__developerInfo}>
                    <img src={developer.avatar} alt="user's avatar" />
                    <div className={classes.newMemberModal__developerMainInfo}>
                      <p className={classes.newMemberModal__developerName}>
                        {developer.name}
                      </p>

                      <p className={classes.newMemberModal__developerJobTitle}>
                        {developer.jobTitle}
                      </p>
                    </div>
                  </div>

                  <button
                    className={classes.newMemberModal__inviteUserButton}
                    onClick={() => {
                      onConfirmInviteButtonClick(developer);
                    }}
                  >
                    Invite
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </Modal>
  );
};

export default NewMemberModal;
