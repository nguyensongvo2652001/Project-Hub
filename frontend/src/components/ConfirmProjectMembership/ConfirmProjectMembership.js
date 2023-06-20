import { useEffect, useState } from "react";
import Loading from "../UI/Loading/Loading";
import classes from "./ConfirmProjectMembership.module.css";
import AuthPageLayout from "../Layout/AuthPageLayout/AuthPageLayout";
import feelingSad from "../../assets/feelingSad.png";
import confirmed from "../../assets/confirmed.png";
import useSendRequest from "../../hooks/useSendRequest";
import { useParams } from "react-router-dom";

const ConfirmProjectMembership = () => {
  const params = useParams();
  const { invitationToken } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(
    "Your membership has been confirmed !"
  );
  const [successfulConfirm, setSuccessfulConfirm] = useState(true);
  const { sendRequest } = useSendRequest();
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const confirmMembership = async () => {
      const confirmMembershipURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/projectMember/confirmMembership/${invitationToken}`;

      setIsLoading(true);
      try {
        const response = await sendRequest(confirmMembershipURL, {
          method: "PATCH",
        });

        if (response.status !== "success") {
          throw new Error(response.message);
        }

        setSuccessfulConfirm(true);
        setMessage("Confirm your membership successfully");
      } catch (err) {
        setSuccessfulConfirm(false);
        setMessage(err.message);
      }

      setIsLoading(false);
    };

    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }

    confirmMembership();
  }, [invitationToken, isInitialRender, sendRequest]);

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
