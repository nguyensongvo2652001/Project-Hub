import { useNavigate, useLocation } from "react-router-dom";

import navItemStyles from "./NavItem.module.css";

const NavItem = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = props;

  const { link } = item;
  const currentLink = location.pathname;
  const isActive = currentLink === link;

  const clickHandler = () => {
    navigate(link);
  };

  let classes = `${navItemStyles.navItem} `;
  if (isActive) classes += `${navItemStyles["navItem--active"]}`;

  return (
    <li className={classes} onClick={clickHandler}>
      <ion-icon name={item.iconName}></ion-icon>
      <p>{item.text}</p>
    </li>
  );
};

export default NavItem;
