import React from "react";

const TASK_STATUS_CONSTANT = ["open", "doing", "testing", "overdue", "closed"];

const PROJECT_TAGS = [
  "Website",
  "Mobile",
  "Software",
  "AI",
  "CloudComputing",
  "Security",
  "Other",
  "Data",
];

const MEMBER_ROLES = ["owner", "admin", "developer"];

const ConstantContext = React.createContext({
  TASK_STATUS_CONSTANT,
  PROJECT_TAGS,
  MEMBER_ROLES,
});

export const ConstantContextProvider = (props) => {
  const constants = { TASK_STATUS_CONSTANT, PROJECT_TAGS, MEMBER_ROLES };

  return (
    <ConstantContext.Provider value={constants}>
      {props.children}
    </ConstantContext.Provider>
  );
};

export default ConstantContext;
