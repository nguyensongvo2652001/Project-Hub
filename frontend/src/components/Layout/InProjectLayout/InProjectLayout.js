import React from "react";

import InProjectNavbar from "../../Navbars/InProjectNavbar/InProjectNavbar.js";
import AuthPageLayout from "../AuthPageLayout/AuthPageLayout";

import { useNavigate, useParams } from "react-router-dom";
import useSendRequest from "../../../hooks/useSendRequest.js";
import { useEffect, useState } from "react";

import classes from "./InProjectLayout.module.css";
import Loading from "../../UI/Loading/Loading.js";

const InProjectLayout = (props) => {
  const params = useParams();
  const projectId = params.id;

  const { sendRequest } = useSendRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getProjectDetailURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${projectId}`;
    const getProjectDetailRequest = async () => {
      setIsLoading(true);
      const response = await sendRequest(getProjectDetailURL);

      if (response.statusCode !== 200) {
        return navigate("/forbidden");
      }

      setProject(response.data.project);

      setIsLoading(false);
    };

    getProjectDetailRequest();
  }, [sendRequest, projectId, navigate]);

  return (
    <AuthPageLayout>
      <div className={classes.inProjectLayout}>
        <InProjectNavbar props={projectId} />
        {isLoading && <Loading />}
        {!isLoading &&
          React.Children.map(props.children, (child) => {
            return React.cloneElement(child, { project });
          })}
      </div>
    </AuthPageLayout>
  );
};

export default InProjectLayout;
