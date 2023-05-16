import navBarStyles from "./NavBar.module.css";
import logo from "../../assets/logo.png";
import avatar1 from "../../assets/avatar1.jpg";
import NavItemList from "./NavItemList";

const MainNavBar = (props) => {
  const navItems = [
    {
      text: "First link",
    },
    { text: "Second link" },
    { text: "Third link", isActive: true },
    { text: "Fourth link" },
  ];

  return (
    <div className={navBarStyles.navbar}>
      <img
        src={logo}
        alt="ProjectHub logo"
        className={navBarStyles.navbar__logo}
      />
      <div className={navBarStyles.navbar__userInfo}>
        <img
          src={avatar1}
          alt="user avatar"
          className={navBarStyles.navbar__avatar}
        />
        <p className={navBarStyles.navbar__name}>Jonathan Doe</p>
        <p className={navBarStyles.navbar__jobTitle}>Backend Developer</p>
      </div>

      <NavItemList items={navItems} />

      <div className={navBarStyles.navbar__logOutButton}>
        <ion-icon name="power-outline"></ion-icon>
        <p>Log out</p>
      </div>
    </div>
  );
};

export default MainNavBar;
