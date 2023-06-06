import classes from "./Dropdown.module.css";

const Dropdown = (props) => {
  const { options, inputRef } = props;

  const allClassNames = `${classes.dropdown} ${props.className}`;

  return (
    <select className={allClassNames} ref={inputRef} onChange={props.onChange}>
      {options.map((optionValue, index) => {
        return (
          <option value={optionValue} key={index}>
            {optionValue}
          </option>
        );
      })}
    </select>
  );
};

export default Dropdown;
