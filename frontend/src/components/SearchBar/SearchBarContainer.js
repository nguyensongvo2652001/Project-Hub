import SearchBar from "./SearchBar";
import classes from "./SearchBarContainer.module.css";

const SearchBarContainer = (props) => {
  return (
    <div className={classes.searchBarContainer}>
      <SearchBar />
    </div>
  );
};

export default SearchBarContainer;
