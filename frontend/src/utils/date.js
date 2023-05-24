export const getDateDisplay = (date) => {
  const dateDisplay = new Date(date).toLocaleDateString("en-GB");
  return dateDisplay;
};

export const convertNumberToMonthName = (monthNumber) => {
  const monthName = new Date(0, monthNumber - 1).toLocaleString("en-US", {
    month: "long",
  });
  return monthName;
};
