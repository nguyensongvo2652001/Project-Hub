import NavItem from "./NavItem";
import styles from "./NavItemList.module.css";

const NavItemList = (props) => {
  const navItems = props.items.map((item, index) => {
    return <NavItem text={item.text} key={index} link={item.link} />;
  });

  return <ul className={styles.navItemList}>{navItems}</ul>;
};

export default NavItemList;
