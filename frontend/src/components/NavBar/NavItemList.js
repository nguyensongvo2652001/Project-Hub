import NavItem from "./NavItem";
import styles from "./NavItemList.module.css";

const NavItemList = (props) => {
  const navItems = props.items.map((item, index) => {
    return <NavItem isActive={item.isActive} text={item.text} key={index} />;
  });

  return <ul className={styles.navItemList}>{navItems}</ul>;
};

export default NavItemList;
