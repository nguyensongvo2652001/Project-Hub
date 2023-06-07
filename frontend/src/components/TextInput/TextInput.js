import classes from "./TextInput.module.css";

const TextInput = (props) => {
  // type needs to be related to text (for instance email is fine but image is not)
  const { type, placeholder, defaultValue, id, inputRef } = props;

  const allClasses = `${props.className} ${classes.textInput}`;

  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      id={id}
      className={allClasses}
      ref={inputRef}
    />
  );
};

export default TextInput;
