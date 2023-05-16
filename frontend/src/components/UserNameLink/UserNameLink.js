import { Link } from "react-router-dom";
import styles from "./UserNameLink.module.css";

const UserNameLink = (props) => {
  const { name, id } = props;

  return (
    <Link className={styles.link} to={`/users/${id}`}>
      {name}
    </Link>
  );
};

export default UserNameLink;
