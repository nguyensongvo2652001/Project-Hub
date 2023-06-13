import classes from "./ChosenDevelopersRow.module.css";

import avatar from "../../assets/avatar1.jpg";
import { useState } from "react";
import ChooseDevelopersModal from "../ChooseDevelopersModal/ChooseDevelopersModal";

const ChosenDevelopersRow = (props) => {
  const [showDevelopersEditModal, setShowDevelopersEditModal] = useState(false);

  const onChosenDevelopersEditButtonClick = (event) => {
    event.preventDefault();

    setShowDevelopersEditModal(true);
  };

  const closeDevelopersEditModal = () => {
    setShowDevelopersEditModal(false);
  };

  return (
    <div className={classes.chosenDevelopersRowContainer}>
      <ul className={classes.chosenDevelopersList}>
        <li className={classes.chosenDeveloper}>
          <img src={avatar} alt="User's avatar" />
        </li>

        <li className={classes.chosenDeveloper}>
          <img src={avatar} alt="User's avatar" />
        </li>

        <li className={classes.chosenDeveloper}>
          <img src={avatar} alt="User's avatar" />
        </li>

        <li className={classes.chosenDeveloper}>
          <div className={classes.chosenDeveloperAddition}>
            <p>+5</p>
          </div>
        </li>
      </ul>

      <button
        className={classes.chosenDevelopersEditButton}
        onClick={onChosenDevelopersEditButtonClick}
      >
        Edit
      </button>

      {showDevelopersEditModal && (
        <ChooseDevelopersModal onClick={closeDevelopersEditModal} />
      )}
    </div>
  );
};

export default ChosenDevelopersRow;
