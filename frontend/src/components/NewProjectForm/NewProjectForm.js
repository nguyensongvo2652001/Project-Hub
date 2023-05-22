import TextInput from "../TextInput/TextInput";

import classes from "./NewProjectForm.module.css";

const NewProjectForm = (props) => {
  return (
    <form className={classes.newProjectForm}>
      <div className={classes.newProjectForm__controlGroup}>
        <label className={classes.newProjectForm__label} id="name">
          Name
        </label>
        <TextInput
          id="name"
          value=""
          placeholder="your project name"
          type="text"
        />
      </div>

      <div className={classes.newProjectForm__controlGroup}>
        <label className={classes.newProjectForm__label} id="description">
          Description
        </label>
        <TextInput
          id="description"
          value=""
          placeholder="your project description"
          type="text"
        />
      </div>

      <div className={classes.newProjectForm__controlGroup}>
        <label className={classes.newProjectForm__label} id="tag">
          Tag
        </label>
        <select className={classes.newProjectForm__tagDropdown}>
          <option value="Website">Website</option>
          <option value="Mobile">Mobile</option>
          <option value="Other">Other</option>
          <option value="Software">Software</option>
        </select>
      </div>

      <div className={classes.newProjectForm__controlGroup}>
        <label className={classes.newProjectForm__label} id="status">
          Status
        </label>
        <div className={classes.newProjectForm__statusRadioButtons}>
          <div className={classes.newProjectForm__radioButtonContainer}>
            <div className={classes.radioButton}></div>
            <p>Private</p>
          </div>

          <div className={classes.newProjectForm__radioButtonContainer}>
            <div className={classes.radioButton}></div>
            <p>Public</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewProjectForm;
