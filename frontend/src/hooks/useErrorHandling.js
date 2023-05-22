import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const useErrorHandling = () => {
  const [error, setError] = useState(undefined);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false, // Make the notification sticky
        className: "error-notification",
      });
    }
  }, [error]);

  const handleError = useCallback((err) => {
    setError(err);
  }, []);

  return handleError;
};

export default useErrorHandling;
