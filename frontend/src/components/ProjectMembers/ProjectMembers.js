import InProjectWithHeaderAndTaskStatRowLayout from "../Layout/InProjectWithHeaderAndTaskStatRowLayout/InProjectWithHeaderAndTaskStatRowLayout";
import ProjectMember from "../ProjectMember/ProjectMember";

import classes from "./ProjectMembers.module.css";

import avatar from "../../assets/avatar1.jpg";

import { useCallback, useContext, useEffect, useState } from "react";
import ConstantContext from "../../contexts/ConstantContext";
import { capitalizeFirstLetter } from "../../utils/string";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { getDateDisplay } from "../../utils/date";
import Loading from "../UI/Loading/Loading";

const ProjectMembers = (props) => {
  const { project } = props;
  console.log(project._id);

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const handleError = useErrorHandling();

  const maxProjectMembersPerRequestLimit = 10;
  const [getProjectMembersPage, setGetProjectMembersPage] = useState(1);

  const [noMoreProjectMembers, setNoMoreProjectMembers] = useState(false);
  const [lastProjectMember, setLastProjectMember] = useState(null);
  const { sendRequest } = useSendRequest();

  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    if (noMoreProjectMembers) {
      return;
    }

    const getMoreProjectMembers = async () => {
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      const getProjectMembersURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/member?limit=${maxProjectMembersPerRequestLimit}&page=${getProjectMembersPage}`;

      setIsLoading(true);
      const response = await sendRequest(getProjectMembersURL);

      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const moreMemberships = response.data.members;

      if (moreMemberships.length === 0) {
        setNoMoreProjectMembers(true);
      }

      setMemberships((prev) => [...prev, ...moreMemberships]);

      setIsLoading(false);

      try {
      } catch (err) {
        handleError(err);
      }
    };

    getMoreProjectMembers();
  }, [
    getProjectMembersPage,
    noMoreProjectMembers,
    handleError,
    project._id,
    sendRequest,
  ]);

  const checkIfShouldStopObservingLastProjectMember = useCallback(() => {
    return noMoreProjectMembers;
  }, [noMoreProjectMembers]);

  const actionWhenLastProjectMemberInViewport = useCallback(async () => {
    setGetProjectMembersPage((prev) => prev + 1);
  }, []);

  useIntersectionObserver(
    checkIfShouldStopObservingLastProjectMember,
    lastProjectMember,
    actionWhenLastProjectMemberInViewport
  );

  const constantContext = useContext(ConstantContext);

  const memberRolesOption = constantContext.MEMBER_ROLES;

  const capitalizedMemberRolesOption = memberRolesOption.map((option) =>
    capitalizeFirstLetter(option)
  );
  capitalizedMemberRolesOption.unshift("All");

  return (
    <InProjectWithHeaderAndTaskStatRowLayout
      dropDownOptions={capitalizedMemberRolesOption}
    >
      {isLoading && <Loading />}
      {!isLoading && (
        <ul className={classes.members}>
          {memberships.map((membership, index) => {
            const {
              memberId: member,
              dateJoined,
              performance,
              role,
            } = membership;

            member.role = role;

            const memberMetaInfo = [
              {
                title: "Date joined: ",
                value: getDateDisplay(dateJoined),
              },
              {
                title: "Total tasks: ",
                value: performance.totalTasksCount,
              },
              {
                title: "Completion rate: ",
                value: `${performance.completionRate} %`,
              },
            ];

            if (index === member.length - 1) {
              return (
                <ProjectMember
                  member={member}
                  memberMetaInfo={memberMetaInfo}
                  key={member._id}
                  ref={setLastProjectMember}
                />
              );
            }

            return (
              <ProjectMember
                member={member}
                memberMetaInfo={memberMetaInfo}
                key={member._id}
              />
            );
          })}
        </ul>
      )}
    </InProjectWithHeaderAndTaskStatRowLayout>
  );
};

export default ProjectMembers;
