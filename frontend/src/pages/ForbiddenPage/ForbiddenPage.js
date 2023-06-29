import classes from "./ForbiddenPage.module.css";
import forbidden from "../../assets/forbidden.png";

const ForbiddenPage = () => {
  return (
    <div className={classes.forbidden}>
      <img
        className={classes.forbidden__image}
        src={forbidden}
        alt="A person standing next to a giant smartphone with a X mark on the screen"
      />
      <p className={classes.forbidden__text}>
        You are not allowed to view this page.
      </p>
    </div>
  );
};

export default ForbiddenPage;
