import NavItem from "../NavItem/NavItem";
import styles from "./NavItemList.module.css";

const NavItemList = (props) => {
  const navItems = props.items.map((item, index) => {
    return <NavItem item={item} key={index} />;
  });

  return <ul className={styles.navItemList}>{navItems}</ul>;
};

export default NavItemList;
