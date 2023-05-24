import { toast } from "react-toastify";

export const successAlert = (message) => {
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};
