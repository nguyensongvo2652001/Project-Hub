import { useNavigate } from "react-router-dom";
import styles from "./AvatarLink.module.css";

const AvatarLink = (props) => {
  const { src, alt, id } = props;
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(`/users/${id}`);
  };

  return (
    <img
      className={props.className}
      src={src}
      alt={alt}
      onClick={clickHandler}
    />
  );
};

export default AvatarLink;
