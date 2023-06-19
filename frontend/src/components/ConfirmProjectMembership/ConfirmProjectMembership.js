import { useState } from "react";
import Loading from "../UI/Loading/Loading";
import classes from "./ConfirmProjectMembership.module.css";
import AuthPageLayout from "../Layout/AuthPageLayout/AuthPageLayout";
import feelingSad from "../../assets/feelingSad.png";
import confirmed from "../../assets/confirmed.png";

const ConfirmProjectMembership = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(
    "Your membership has been confirmed !"
  );
  const [successfulConfirm, setSuccessfulConfirm] = useState(true);

  return (
    <AuthPageLayout>
      <div className={classes.confirmProjectMembership}>
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <p className={classes.confirmProjectMembership__message}>
              {message}
            </p>
            <div className={classes.confirmProjectMembership__imageContainer}>
              {successfulConfirm && (
                <img
                  src={confirmed}
                  alt="a large tick"
                  className={classes.confirmProjectMembership__image}
                />
              )}
              {!successfulConfirm && (
                <img
                  src={feelingSad}
                  alt="a woman standing next to a large sad face"
                  className={classes.confirmProjectMembership__image}
                />
              )}
            </div>
          </>
        )}
      </div>
    </AuthPageLayout>
  );
};

export default ConfirmProjectMembership;
