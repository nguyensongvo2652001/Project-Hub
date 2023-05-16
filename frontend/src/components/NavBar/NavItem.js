import navItemStyles from "./NavItem.module.css";

const NavItem = (props) => {
  const { isActive } = props;

  let classes = `${navItemStyles.navItem} `;
  if (isActive) classes += `${navItemStyles["navItem--active"]}`;

  return <li className={classes}>{props.text}</li>;
};

export default NavItem;
