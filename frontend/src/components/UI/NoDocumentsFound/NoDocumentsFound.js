import styles from "./NoDocumentsFound.module.css";

const NoDocumentsFound = (props) => {
  const allClasses = `${props.className} ${styles.noDocumentsFound}`;
  return (
    <div className={allClasses}>
      <ion-icon name="cart-outline"></ion-icon>
      <h1>Cart is empty.</h1>
      <p>{props.message}</p>
    </div>
  );
};

export default NoDocumentsFound;
