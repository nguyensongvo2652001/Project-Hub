import navBarStyles from "./NavBar.module.css";
import logo from "../../assets/logo.png";
import avatar1 from "../../assets/avatar1.jpg";
import NavItemList from "./NavItemList";
import { useContext, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import AuthContext from "../../contexts/AuthContext";
import Modal from "../UI/Modal/Modal";

const MainNavBar = (props) => {
  const navItems = [
    {
      text: "Statistic",
      link: "/me/stat",
    },
    { text: "Project", link: "/projects" },
    { text: "Profile", link: "/me" },
    { text: "Notifications", link: "/me/notifications" },
  ];

  const [showLogOutModal, setShowLogOutModal] = useState(false);

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
  // if (userJobTitleDisplay && userJobTitleDisplay.length > 20) {
  //   userJobTitleDisplay = userJobTitleDisplay.slice(0, 17) + "...";
  // }

  const { sendRequest } = useSendRequest();
  const confirmLogOutHandler = async () => {
    const logoutUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`;
    try {
      await sendRequest(logoutUrl);
      authContext.logOut();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={navBarStyles.navbar}>
      <img
        src={logo}
        alt="ProjectHub logo"
        className={navBarStyles.navbar__logo}
      />
      <div className={navBarStyles.navbar__userInfo}>
        <img
          src={currentUser.avatar}
          alt="user avatar"
          className={navBarStyles.navbar__avatar}
        />
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
