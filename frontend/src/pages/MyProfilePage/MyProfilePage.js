import AuthPageLayout from "../../components/Layout/AuthPageLayout/AuthPageLayout.js";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import TextAreaInput from "../../components/TextAreaInput/TextAreaInput";
import TextInput from "../../components/TextInput/TextInput";
import { Backdrop } from "../../components/UI/Modal/Modal";
import Loading from "../../components/UI/Loading/Loading";
import AuthContext from "../../contexts/AuthContext";

import { useContext, useEffect, useRef, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";

import classes from "./MyProfilePage.module.css";
import { successAlert } from "../../utils/alert";

const MyProfilePage = (props) => {
  const authContext = useContext(AuthContext);

  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const [isLoading, setIsLoading] = useState(false);

  const [userBackgroundSrc, setUserBackgroundSrc] = useState(
    authContext.currentUser.background
  );
  const [userAvatarSrc, setUserAvatarSrc] = useState(
    authContext.currentUser.avatar
  );
  const [userBackgroundFile, setUserBackgroundFile] = useState(undefined);
  const [userAvatarFile, setUserAvatarFile] = useState(undefined);

  const nameRef = useRef();
  const jobTitleRef = useRef();
  const descriptionRef = useRef();

  // It seems like this component will be rendered before the authContext.currentUser is loaded so we need work around it using useEffect
  useEffect(() => {
    setUserAvatarSrc(authContext.currentUser.avatar);
    setUserBackgroundSrc(authContext.currentUser.background);
  }, [authContext]);

  const imageInputOnChange = (setImageSourceFunc, setImageFile, event) => {
    //Save the recently uploaded file to send it in a request later.
    const file = event.target.files[0];
    setImageFile(file);

    const reader = new FileReader();

    // Replace the current image src with the recently uploaded image.
    reader.onload = async function (event) {
      const imageData = event.target.result;

      setImageSourceFunc(imageData);
    };

    reader.readAsDataURL(file);
  };

  const onSaveForm = async (event) => {
    event.preventDefault();

    const nameInput = nameRef.current.value;
    const jobTitleInput = jobTitleRef.current.value;
    const descriptionInput = descriptionRef.current.value;

    const formData = new FormData();
    formData.append("name", nameInput);
    formData.append("jobTitle", jobTitleInput);
    formData.append("description", descriptionInput);

    if (userAvatarFile) {
      formData.append("avatar", userAvatarFile);
    }

    if (userBackgroundFile) {
      formData.append("background", userBackgroundFile);
    }

    try {
      setIsLoading(true);
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/me`,
        {
          method: "PATCH",
          headers: {},
          body: formData,
        }
      );

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      //Call this function to update the current user info again.
      await authContext.checkIfUserIsLoggedIn();

      setIsLoading(false);

      successAlert("Updated profled successfully");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.myProfilePage}>
        {isLoading && (
          <div className={classes.myProfilePage__loadingContainer}>
            <Loading className={classes.myProfilePage__loading} />
            <Backdrop />
          </div>
        )}

        <div className={classes.myProfilePage__backgroundContainer}>
          <img
            src={userBackgroundSrc}
            alt="user's background"
            className={classes.myProfilePage__background}
          />
          <form className={classes.myProfilePage__backgroundUploadForm}>
            <label htmlFor="background-input">
              <ion-icon name="camera-outline"></ion-icon>
            </label>
            <input
              type="file"
              id="background-input"
              accept="image/*"
              onChange={imageInputOnChange.bind(
                null,
                setUserBackgroundSrc,
                setUserBackgroundFile
              )}
            />
          </form>
        </div>

        <div className={classes.myProfilePage__avatarAndTitleContainer}>
          <div className={classes.myProfilePage__avatarContainer}>
            <img
              src={userAvatarSrc}
              alt="user's avatar"
              className={classes.myProfilePage__avatar}
            />
            <form className={classes.myProfilePage__avatarUploadForm}>
              <label htmlFor="avatar-input">
                <ion-icon name="camera-outline"></ion-icon>
              </label>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={imageInputOnChange.bind(
                  null,
                  setUserAvatarSrc,
                  setUserAvatarFile
                )}
              />
            </form>
          </div>

          <div className={classes.myProfilePage__titleContainer}>
            <h1>Profile</h1>
            <p>Update your pictures and personal details.</p>
          </div>

          <button
            className={classes.myProfilePage__saveButton}
            onClick={onSaveForm}
          >
            Save
          </button>
        </div>

        <form className={classes.myProfilePage__textForm}>
          <div className={classes.formControlGroup}>
            <label htmlFor="name">Name</label>
            <TextInput
              type="text"
              placeholder="your name here"
              id="name"
              defaultValue={authContext.currentUser.name}
              inputRef={nameRef}
            />
          </div>

          <div className={classes.formControlGroup}>
            <label htmlFor="jobTitle">Job Title</label>
            <TextInput
              type="text"
              placeholder="your job title here"
              id="jobTitle"
              defaultValue={authContext.currentUser.jobTitle}
              inputRef={jobTitleRef}
            />
          </div>

          <div className={classes.formControlGroup}>
            <label htmlFor="description">Description</label>
            <TextAreaInput
              type="text"
              placeholder="your description here"
              id="description"
              defaultValue={authContext.currentUser.description}
              inputRef={descriptionRef}
            />
          </div>
        </form>
      </div>
    </AuthPageLayout>
  );
};

export default MyProfilePage;
