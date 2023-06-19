import classes from "./SearchBar.module.css";

const SearchBar = (props) => {
  const { onChange, onClick, inputRef } = props;

  const allClasses = `${classes.searchBar} ${props.className}`;

  return (
    <div className={allClasses}>
      <textarea
        cols="35"
        placeholder="Search"
        className={classes.searchBarInput}
        onChange={onChange}
        ref={inputRef}
      ></textarea>
      <ion-icon name="search-outline" onClick={onClick}></ion-icon>
    </div>
  );
};

export default SearchBar;
