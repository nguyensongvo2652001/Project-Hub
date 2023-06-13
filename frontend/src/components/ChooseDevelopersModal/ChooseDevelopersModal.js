import Modal from "../UI/Modal/Modal.js";
import RadioButton from "../RadioButton/RadioButton.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchBarContainer from "../SearchBar/SearchBarContainer.js";
import Loading from "../UI/Loading/Loading.js";

import { useState } from "react";
import useSendRequest from "../../hooks/useSendRequest.js";
import useErrorHandling from "../../hooks/useErrorHandling.js";
import useIntersectionObserver from "../../hooks/useIntersectionObserver.js";

import debounce from "../../utils/debounce.js";

import classes from "./ChooseDevelopersModal.module.css";

import avatar from "../../assets/avatar1.jpg";

const ChooseDevelopersModal = (props) => {
  const { onClick, project, chosenDevelopers, setChosenDevelopers } = props;

  const [displayDevelopers, setDisplayDevelopers] = useState(chosenDevelopers);
  const [isLoading, setIsLoading] = useState(false);

  const onDeveloperRadioButtonClick = (
    currentActiveState,
    radioButtonDeveloper
  ) => {
    if (currentActiveState === true) {
      setChosenDevelopers((prevChosenDevelopers) => {
        const newChosenDevelopers = prevChosenDevelopers.filter(
          (developer) => developer._id !== radioButtonDeveloper._id
        );
        return newChosenDevelopers;
      });
    } else {
      setChosenDevelopers((prevChosenDevelopers) => {
        const newChosenDevelopers = prevChosenDevelopers.slice();
        newChosenDevelopers.push(radioButtonDeveloper);
        return newChosenDevelopers;
      });
    }
  };

  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const searchMembers = debounce(async (query) => {
    setIsLoading(true);
    try {
      const searchMembersURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/member/search?q=${query}`;
      const response = await sendRequest(searchMembersURL);

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const { memberships } = response.data;
      const members = memberships.map((membership) => membership.memberId);
      setDisplayDevelopers(members);
    } catch (err) {
      handleError(err);
    }
    setIsLoading(false);
  }, 0.3);

  const onSearchInputChange = (event) => {
    searchMembers(event.target.value);
  };

  return (
    <Modal
      onClick={onClick}
      className={classes.chooseDevelopersModal__modal}
      backdropClassName={classes.chooseDevelopersModal__backdrop}
    >
      <div className={classes.chooseDevelopersModal__content}>
        <h1 className={classes.chooseDevelopersModal__title}>
          Edit developers
        </h1>

        <SearchBar
          className={classes.chooseDevelopersModal__searchBar}
          onChange={onSearchInputChange}
        />

        <ul className={classes.chooseDevelopersModal__developersList}>
          {isLoading && <Loading />}
          {!isLoading && displayDevelopers.length === 0 && (
            <p className={classes.chooseDevelopersModal__noChosenDevelopers}>
              No developers found
            </p>
          )}
          {!isLoading &&
            displayDevelopers.map((developer) => {
              const chosenDevelopersID = chosenDevelopers.map(
                (developer) => developer._id
              );
              const isInChosenDevelopers = chosenDevelopersID.includes(
                developer._id
              );
              return (
                <li
                  className={classes.chooseDevelopersModal__developer}
                  key={developer._id}
                >
                  <div className={classes.chooseDevelopersModal__developerInfo}>
                    <img src={developer.avatar} alt="user's avatar" />
                    <div
                      className={
                        classes.chooseDevelopersModal__developerMainInfo
                      }
                    >
                      <p
                        className={classes.chooseDevelopersModal__developerName}
                      >
                        {developer.name}
                      </p>

                      <p
                        className={
                          classes.chooseDevelopersModal__developerJobTitle
                        }
                      >
                        {developer.jobTitle}
                      </p>
                    </div>
                  </div>

                  <RadioButton
                    active={isInChosenDevelopers}
                    value={developer}
                    onClick={onDeveloperRadioButtonClick}
                  />
                </li>
              );
            })}
        </ul>
      </div>
    </Modal>
  );
};

export default ChooseDevelopersModal;
