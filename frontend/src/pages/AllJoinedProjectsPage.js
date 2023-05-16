import { useContext, useRef } from "react";
import Modal from "../components/UI/Modal/Modal";
import useSendRequest from "../hooks/useSendRequest";
import AuthContext from "../contexts/AuthContext";
import Cookies from "js-cookie";

const AllJoinedProjectsPage = () => {
  const logOutConfirmModalRef = useRef();
  const toggleModal = () => {
    logOutConfirmModalRef.current.toggleShowModal();
  };
  const authContext = useContext(AuthContext);
  const { sendRequest } = useSendRequest();
  const confirmLogOutHandler = async () => {
    const logoutUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/logout`;
    try {
      const responseBody = await sendRequest(logoutUrl);
      console.log(responseBody);
      authContext.logOut();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>AllJoinedProjectsPage</h1>
      <button onClick={toggleModal}>Log out</button>
      <Modal ref={logOutConfirmModalRef}>
        <h1>Log out confirm</h1>
        <button onClick={confirmLogOutHandler}>Log me out</button>
        <button onClick={toggleModal}>Cancel</button>
      </Modal>
    </>
  );
};

export default AllJoinedProjectsPage;
