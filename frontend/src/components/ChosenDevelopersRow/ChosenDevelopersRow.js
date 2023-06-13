import classes from "./ChosenDevelopersRow.module.css";

import avatar from "../../assets/avatar1.jpg";
import { useState } from "react";
import ChooseDevelopersModal from "../ChooseDevelopersModal/ChooseDevelopersModal";

const ChosenDevelopersRow = (props) => {
  const { project } = props;

  const [chosenDevelopers, setChosenDevelopers] = useState([]);
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
        {
          //We only show the first 3 developers
          chosenDevelopers.slice(0, 3).map((developer) => {
            return (
              <li className={classes.chosenDeveloper}>
                <img src={developer.avatar} alt="User's avatar" />
              </li>
            );
          })
        }
        {chosenDevelopers.length > 3 && (
          <li className={classes.chosenDeveloper}>
            <div className={classes.chosenDeveloperAddition}>
              <p>+{chosenDevelopers.length - 3}</p>
            </div>
          </li>
        )}
      </ul>

      <button
        className={classes.chosenDevelopersEditButton}
        onClick={onChosenDevelopersEditButtonClick}
      >
        Edit
      </button>

      {showDevelopersEditModal && (
        <ChooseDevelopersModal
          chosenDevelopers={chosenDevelopers}
          setChosenDevelopers={setChosenDevelopers}
          onClick={closeDevelopersEditModal}
          project={project}
        />
      )}
    </div>
  );
};

export default ChosenDevelopersRow;
