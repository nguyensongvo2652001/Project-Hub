import React from "react";

const TASK_STATUS_CONSTANT_VALUE = [
  "open",
  "doing",
  "testing",
  "overdue",
  "closed",
];

const ConstantContext = React.createContext({
  TASK_STATUS_CONSTANT: TASK_STATUS_CONSTANT_VALUE,
});

export const ConstantContextProvider = (props) => {
  const constants = { TASK_STATUS_CONSTANT: TASK_STATUS_CONSTANT_VALUE };

  return (
    <ConstantContext.Provider value={constants}>
      {props.children}
    </ConstantContext.Provider>
  );
};

export default ConstantContext;
