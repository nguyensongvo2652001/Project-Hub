import { useContext } from "react";
import Dropdown from "../Dropdown/Dropdown";

import ConstantContext from "../../../contexts/ConstantContext";

const ProjectTagDropdown = (props) => {
  const { inputRef, className, defaultOption } = props;

  const constantContext = useContext(ConstantContext);
  const tagOptions = constantContext.PROJECT_TAGS;

  return (
    <Dropdown
      inputRef={inputRef}
      options={tagOptions}
      className={className}
      defaultOption={defaultOption}
    />
  );
};

export default ProjectTagDropdown;
