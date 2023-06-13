import Modal from "../UI/Modal/Modal.js";
import RadioButton from "../RadioButton/RadioButton.js";
import SearchBar from "../SearchBar/SearchBar.js";

import classes from "./ChooseDevelopersModal.module.css";

import avatar from "../../assets/avatar1.jpg";

const ChooseDevelopersModal = (props) => {
  const { onClick } = props;

  return (
    <Modal
      onClick={onClick}
      className={classes.chooseDevelopersModal__modal}
      backdropClassName={classes.chooseDevelopersModal__backdrop}
    >
      <h1 className={classes.chooseDevelopersModal__title}>Edit developers</h1>
      <SearchBar />
      <ul className={classes.chooseDevelopersModal__developersList}>
        <li className={classes.chooseDevelopersModal__developer}>
          <div className={classes.chooseDevelopersModal__developerInfo}>
            <img src={avatar} alt="user's avatar" />
            <div className={classes.chooseDevelopersModal__developerMainInfo}>
              <p className={classes.chooseDevelopersModal__developerName}>
                Jonathan Isaac
              </p>

              <p className={classes.chooseDevelopersModal__developerJobTitle}>
                Backend Engineer
              </p>
            </div>
          </div>

          <RadioButton active={true} />
        </li>

        <li className={classes.chooseDevelopersModal__developer}>
          <div className={classes.chooseDevelopersModal__developerInfo}>
            <img src={avatar} alt="user's avatar" />
            <div className={classes.chooseDevelopersModal__developerMainInfo}>
              <p className={classes.chooseDevelopersModal__developerName}>
                Jonathan Isaac
              </p>

              <p className={classes.chooseDevelopersModal__developerJobTitle}>
                Backend Engineer
              </p>
            </div>
          </div>

          <RadioButton active={true} />
        </li>

        <li className={classes.chooseDevelopersModal__developer}>
          <div className={classes.chooseDevelopersModal__developerInfo}>
            <img src={avatar} alt="user's avatar" />
            <div className={classes.chooseDevelopersModal__developerMainInfo}>
              <p className={classes.chooseDevelopersModal__developerName}>
                Jonathan Isaac
              </p>

              <p className={classes.chooseDevelopersModal__developerJobTitle}>
                Backend Engineer
              </p>
            </div>
          </div>

          <RadioButton active={true} />
        </li>

        <li className={classes.chooseDevelopersModal__developer}>
          <div className={classes.chooseDevelopersModal__developerInfo}>
            <img src={avatar} alt="user's avatar" />
            <div className={classes.chooseDevelopersModal__developerMainInfo}>
              <p className={classes.chooseDevelopersModal__developerName}>
                Jonathan Isaac
              </p>

              <p className={classes.chooseDevelopersModal__developerJobTitle}>
                Backend Engineer
              </p>
            </div>
          </div>

          <RadioButton active={true} />
        </li>

        <li className={classes.chooseDevelopersModal__developer}>
          <div className={classes.chooseDevelopersModal__developerInfo}>
            <img src={avatar} alt="user's avatar" />
            <div className={classes.chooseDevelopersModal__developerMainInfo}>
              <p className={classes.chooseDevelopersModal__developerName}>
                Jonathan Isaac
              </p>

              <p className={classes.chooseDevelopersModal__developerJobTitle}>
                Backend Engineer
              </p>
            </div>
          </div>

          <RadioButton active={true} />
        </li>
      </ul>
    </Modal>
  );
};

export default ChooseDevelopersModal;
