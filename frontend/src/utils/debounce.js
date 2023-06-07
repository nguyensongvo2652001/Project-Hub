const debounce = (func, delayTimeInSeconds) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delayTimeInSeconds * 1000);
  };
};

export default debounce;
