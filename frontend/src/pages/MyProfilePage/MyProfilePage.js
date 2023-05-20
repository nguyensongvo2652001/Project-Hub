import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import background from "../../assets/background.jpg";
import avatar from "../../assets/avatar1.jpg";

import classes from "./MyProfilePage.module.css";
import TextInput from "../../components/TextInput/TextInput";
import { Backdrop } from "../../components/UI/Modal/Modal";
import Loading from "../../components/UI/Loading/Loading";
import { useState } from "react";

const MyProfilePage = (props) => {
  const [isLoading, setIsLoading] = useState(false);

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
            src={background}
            alt="user's background"
            className={classes.myProfilePage__background}
          />
          <form className={classes.myProfilePage__backgroundUploadForm}>
            <label for="background-input">
              <ion-icon name="camera-outline"></ion-icon>
            </label>
            <input type="file" id="background-input" accept="image/*" />
          </form>
        </div>

        <div className={classes.myProfilePage__avatarAndTitleContainer}>
          <div className={classes.myProfilePage__avatarContainer}>
            <img
              src={avatar}
              alt="user's avatar"
              className={classes.myProfilePage__avatar}
            />
            <form className={classes.myProfilePage__avatarUploadForm}>
              <label for="avatar-input">
                <ion-icon name="camera-outline"></ion-icon>
              </label>
              <input type="file" id="avatar-input" accept="image/*" />
            </form>
          </div>

          <div className={classes.myProfilePage__titleContainer}>
            <h1>Profile</h1>
            <p>Update your pictures and personal details.</p>
          </div>

          <button className={classes.myProfilePage__saveButton}>Save</button>
        </div>

        <form className={classes.myProfilePage__textForm}>
          <div className={classes.formControlGroup}>
            <label for="name">Name</label>
            <TextInput type="text" placeholder="your name here" id="name" />
          </div>

          <div className={classes.formControlGroup}>
            <label for="jobTitle">Job Title</label>
            <TextInput
              type="text"
              placeholder="your job title here"
              id="jobTitle"
            />
          </div>

          <div className={classes.formControlGroup}>
            <label for="description">Description</label>
            <TextInput
              type="text"
              placeholder="your name here"
              id="description"
            />
          </div>
        </form>
      </div>
    </AuthPageLayout>
  );
};

export default MyProfilePage;
