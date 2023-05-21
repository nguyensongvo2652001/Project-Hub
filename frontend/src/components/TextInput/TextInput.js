import classes from "./TextInput.module.css";

const TextInput = (props) => {
  // type needs to be related to text (for instance email is fine but image is not)
  const { type, placeholder, value, id } = props;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      id={id}
      className={classes.textInput}
    />
  );
};

export default TextInput;