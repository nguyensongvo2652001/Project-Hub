import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import classes from "./SearchBarContainer.module.css";
import { useRef } from "react";

// This is only for the top search bar
const SearchBarContainer = (props) => {
  const searchInputRef = useRef();
  const navigate = useNavigate();
  const clickSearchIcon = () => {
    const query = searchInputRef.current.value;
    if (query === "") {
      return;
    }

    navigate(`/search?q=${query}`);
    navigate(0);
  };

  return (
    <div className={classes.searchBarContainer}>
      <SearchBar inputRef={searchInputRef} onClick={clickSearchIcon} />
    </div>
  );
};

export default SearchBarContainer;
