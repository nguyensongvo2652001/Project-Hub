import { useEffect, useState } from "react";
import classes from "./ProjectPublicDetail.module.css";
import { getDateDisplay } from "../../utils/date";

import { useNavigate, useParams } from "react-router-dom";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import Loading from "../UI/Loading/Loading";
import AuthPageLayout from "../Layout/AuthPageLayout/AuthPageLayout";
import AvatarLink from "../AvatarLink/AvatarLink";
import Tag from "../UI/Tag/Tag";

const ProjectPublicDetail = () => {
  const params = useParams();
  const projectId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();
  const navigate = useNavigate();

  const [project, setProject] = useState(undefined);

  useEffect(() => {
    const getProjectInfo = async () => {
      const getProjectDetailURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${projectId}/publicDetail`;
      setIsLoading(true);
      try {
        const response = await sendRequest(getProjectDetailURL);
        if (response.statusCode !== 200) {
          navigate("/notFound");
        }

        setProject(response.data.project);
      } catch (err) {
        handleError(err);
      }
      setIsLoading(false);
    };

    getProjectInfo();
  }, [handleError, sendRequest, projectId, navigate]);

  return (
    <AuthPageLayout>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className={classes.projectPublicDetailContainer}>
          <h1 className={classes.projectPublicDetail__title}>{project.name}</h1>
          <ul className={classes.projectPublicDetail__infoList}>
            <li className={classes.projectPublicDetail__info}>
              <label>Owner</label>
              <AvatarLink
                className={`${classes.projectPublicDetail__ownerAvatar} ${classes.projectPublicDetail__infoValue}`}
                alt="owner's avatar"
                src={project.owner.avatar}
                id={project.owner._id}
              />
            </li>

            <li className={classes.projectPublicDetail__info}>
              <label>Date created</label>
              <p className={classes.projectPublicDetail__infoValue}>
                {getDateDisplay(project.dateCreated)}
              </p>
            </li>

            <li className={classes.projectPublicDetail__info}>
              <label>Type</label>
              <Tag
                className={classes.projectPublicDetail__infoValue}
                tag={project.tag}
              />
            </li>

            <li className={classes.projectPublicDetail__info}>
              <label>Number of members</label>
              <p className={classes.projectPublicDetail__infoValue}>
                {project.numberOfMembers}
              </p>
            </li>

            <li className={classes.projectPublicDetail__info}>
              <label>Description</label>
              <p
                className={`${classes.projectPublicDetail__description} ${classes.projectPublicDetail__infoValue}`}
              >
                {project.description}
              </p>
            </li>
          </ul>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default ProjectPublicDetail;
