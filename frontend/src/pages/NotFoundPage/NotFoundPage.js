import classes from "./NotFoundPage.module.css";
import notFoundImage from "../../assets/404.png";

const NotFoundPage = () => {
  return (
    <div className={classes.notFound}>
      <img
        className={classes.notFound__image}
        src={notFoundImage}
        alt="A giant 404 number"
      />
      <p className={classes.notFound__text}>
        We can not find the page you want.
      </p>
    </div>
  );
};

export default NotFoundPage;
