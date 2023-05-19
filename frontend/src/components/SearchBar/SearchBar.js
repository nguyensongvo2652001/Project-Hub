import classes from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <div className={classes.searchBar}>
      <textarea
        cols="35"
        placeholder="Search"
        className={classes.searchBarInput}
      ></textarea>
      <ion-icon name="search-outline"></ion-icon>
    </div>
  );
};

export default SearchBar;
