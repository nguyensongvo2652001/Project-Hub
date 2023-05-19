import SearchBar from "./SearchBar";
import classes from "./SearchBarContainer.module.css";

const SearchBarContainer = () => {
  return (
    <div className={classes.searchBarContainer}>
      <SearchBar />
    </div>
  );
};

export default SearchBarContainer;
