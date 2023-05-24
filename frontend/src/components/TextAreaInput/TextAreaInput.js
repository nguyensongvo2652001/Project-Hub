import classes from "./TextAreaInput.module.css";

const TextAreaInput = (props) => {
  const allClasses = `${props.className} ${classes.textAreaInput}`;

  return (
    <textarea
      cols={props.cols}
      id={props.id}
      placeholder={props.placeholder}
      className={allClasses}
      defaultValue={props.defaultValue}
      ref={props.inputRef}
    />
  );
};

export default TextAreaInput;
