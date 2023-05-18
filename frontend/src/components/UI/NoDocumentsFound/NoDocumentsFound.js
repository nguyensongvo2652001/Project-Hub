import styles from "./NoDocumentsFound.module.css";
import glassImage from "../../../assets/glass.png";

const NoDocumentsFound = (props) => {
  const allClasses = `${props.className} ${styles.noDocumentsFound}`;
  return (
    <div className={allClasses}>
      <img src={glassImage} alt="Somebody holding a glass" />
      <h1>Can't find anything else.</h1>
      <p>{props.message}</p>
    </div>
  );
};

export default NoDocumentsFound;
