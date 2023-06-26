import navBarStyles from "./NavBar.module.css";
import logo from "../../../assets/logo.png";
import NavItemList from "./NavItemList";
import { useContext, useState } from "react";
import useSendRequest from "../../../hooks/useSendRequest";
import AuthContext from "../../../contexts/AuthContext";
import Modal from "../../UI/Modal/Modal";
import useErrorHandling from "../../../hooks/useErrorHandling";

const MainNavBar = (props) => {
  const navItems = [
    {
      text: "Statistic",
      link: "/me/stat",
      iconName: "bar-chart-outline",
    },
    { text: "Project", link: "/projects", iconName: "file-tray-full-outline" },
    { text: "Profile", link: "/me", iconName: "person-outline" },
    {
      text: "Notifications",
      link: "/me/notifications",
      iconName: "megaphone-outline",
    },
  ];

  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const handleError = useErrorHandling();

  const toggleModal = () => {
    setShowLogOutModal((prev) => !prev);
  };

  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;

  let userNameDisplay = currentUser.name || "";
  if (userNameDisplay.length > 12) {
    userNameDisplay = userNameDisplay.slice(0, 9) + "...";
  }

  let userJobTitleDisplay = currentUser.jobTitle || "";
  if (userJobTitleDisplay.length === 0) {
    userJobTitleDisplay = "No job title";
  }

  const confirmLogOutHandler = async () => {
    await authContext.logOut();
  };

  return (
    <div className={navBarStyles.navbar}>
      <div className={navBarStyles.navbar__logoContainer}>
        <img
          src={logo}
          alt="ProjectHub logo"
          className={navBarStyles.navbar__logo}
        />
      </div>
      <div className={navBarStyles.navbar__userInfo}>
        <div className={navBarStyles.navbar__avatarContainer}>
          <img
            src={currentUser.avatar}
            alt="user avatar"
            className={navBarStyles.navbar__avatar}
          />
        </div>
        <p className={navBarStyles.navbar__name}>{userNameDisplay}</p>
        <p className={navBarStyles.navbar__jobTitle}>{userJobTitleDisplay}</p>
      </div>

      <NavItemList items={navItems} />

      <div className={navBarStyles.navbar__logOutButton} onClick={toggleModal}>
        <ion-icon name="power-outline"></ion-icon>
        <p>Log out</p>
      </div>

      {showLogOutModal && (
        <Modal onClick={toggleModal} className={navBarStyles.logOutModal}>
          <img
            src={logo}
            alt="ProjectHub logo"
            className={navBarStyles.logOutModal__logo}
          />
          <p className={navBarStyles.logOutModal__question}>
            Are you sure you want to log out ?
          </p>
          <div className={navBarStyles.logOutModal__buttons}>
            <button
              className={navBarStyles.logOutModal__confirmButton}
              onClick={confirmLogOutHandler}
            >
              Log me out
            </button>
            <button
              className={navBarStyles.logOutModal__cancelButton}
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MainNavBar;
