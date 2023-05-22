export const getDateDisplay = (date) => {
  const dateDisplay = new Date(date).toLocaleDateString("en-GB");
  return dateDisplay;
};
