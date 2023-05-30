import { useContext } from "react";
import Dropdown from "../Dropdown/Dropdown";

import ConstantContext from "../../../contexts/ConstantContext";

const ProjectTagDropdown = (props) => {
  const constantContext = useContext(ConstantContext);
  const tagOptions = constantContext.PROJECT_TAGS;

  return (
    <Dropdown
      inputRef={props.inputRef}
      options={tagOptions}
      className={props.className}
    />
  );
};

export default ProjectTagDropdown;
