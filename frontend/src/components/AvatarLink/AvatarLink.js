import { useNavigate } from "react-router-dom";
import classes from "./AvatarLink.module.css";

const AvatarLink = (props) => {
  const { src, alt, id } = props;
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(`/users/${id}`);
  };

  const allClasses = `${classes.avatarLink} ${props.className}`;

  return (
    <img className={allClasses} src={src} alt={alt} onClick={clickHandler} />
  );
};

export default AvatarLink;
