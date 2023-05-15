import { useRef } from "react";
import Modal from "../components/UI/Modal/Modal";

const AllJoinedProjectsPage = () => {
  const logOutConfirmModalRef = useRef();
  const toggleModal = () => {
    logOutConfirmModalRef.current.toggleShowModal();
  };

  return (
    <>
      <h1>AllJoinedProjectsPage</h1>
      <button onClick={toggleModal}>Log out</button>
      <Modal ref={logOutConfirmModalRef}>
        <h1>Log out confirm</h1>
        <button onClick={toggleModal}>Cancel</button>
      </Modal>
    </>
  );
};

export default AllJoinedProjectsPage;
