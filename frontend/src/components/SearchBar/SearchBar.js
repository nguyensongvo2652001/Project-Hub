import classes from "./SearchBar.module.css";

const SearchBar = (props) => {
  const allClasses = `${classes.searchBar} ${props.className}`;

  return (
    <div className={allClasses}>
      <textarea
        cols="35"
        placeholder="Search"
        className={classes.searchBarInput}
        onChange={props.onChange}
      ></textarea>
      <ion-icon name="search-outline"></ion-icon>
    </div>
  );
};

export default SearchBar;
