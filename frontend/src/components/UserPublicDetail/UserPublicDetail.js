import AuthPageLayout from "../../components/Layout/AuthPageLayout/AuthPageLayout.js";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import Loading from "../../components/UI/Loading/Loading";

import { useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";

import classes from "./UserPublicDetail.module.css";
import { useNavigate, useParams } from "react-router-dom";

const UserPublicDetail = (props) => {
  const params = useParams();
  const userId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();
  const navigate = useNavigate();

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const getUserInfo = async () => {
      const getUserDetailURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/user/${userId}`;
      setIsLoading(true);
      try {
        const response = await sendRequest(getUserDetailURL);
        if (response.statusCode !== 200) {
          navigate("/notFound");
        }

        setUser(response.data.user);
      } catch (err) {
        handleError(err);
      }
      setIsLoading(false);
    };

    getUserInfo();
  }, [handleError, sendRequest, userId, navigate]);

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.userPublicDetail}>
        {isLoading && <Loading className={classes.userPublicDetail__loading} />}
        {!isLoading && (
          <>
            <div className={classes.userPublicDetail__backgroundContainer}>
              <img
                src={user.background}
                alt="user's background"
                className={classes.userPublicDetail__background}
              />
            </div>

            <div className={classes.userPublicDetail__avatarAndTitleContainer}>
              <div className={classes.userPublicDetail__avatarContainer}>
                <img
                  src={user.avatar}
                  alt="user's avatar"
                  className={classes.userPublicDetail__avatar}
                />
              </div>

              <div className={classes.userPublicDetail__titleContainer}>
                <h1>{user.name}'s profile</h1>
              </div>
            </div>

            <div className={classes.userPublicDetail__textForm}>
              <div className={classes.formControlGroup}>
                <label htmlFor="name">Name</label>
                <p>{user.name}</p>
              </div>

              <div className={classes.formControlGroup}>
                <label htmlFor="jobTitle">Job Title</label>
                <p>{user.jobTitle || "Not defined yet"} </p>
              </div>

              <div className={classes.formControlGroup}>
                <label htmlFor="description">Description</label>
                <p>{user.description || "Not defined yet"} </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthPageLayout>
  );
};

export default UserPublicDetail;
