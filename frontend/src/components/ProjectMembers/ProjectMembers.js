import InProjectWithHeaderAndTaskStatRowLayout from "../Layout/InProjectWithHeaderAndStatRowLayout/InProjectWithHeaderAndStatRowLayout";
import ProjectMember from "../ProjectMember/ProjectMember";

import classes from "./ProjectMembers.module.css";

import { useCallback, useContext, useEffect, useState } from "react";
import ConstantContext from "../../contexts/ConstantContext";
import { capitalizeFirstLetter } from "../../utils/string";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";
import { getDateDisplay } from "../../utils/date";
import Loading from "../UI/Loading/Loading";
import NoDocumentsFound from "../UI/NoDocumentsFound/NoDocumentsFound";
import SearchBar from "../SearchBar/SearchBar";
import debounce from "../../utils/debounce";

const ProjectMembers = (props) => {
  const { project } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const handleError = useErrorHandling();

  const maxProjectMembersPerRequestLimit = 10;
  const [getProjectMembersPage, setGetProjectMembersPage] = useState(1);

  const [currentMemberRole, setCurrentMemberRole] = useState("All");

  const [noMoreProjectMembers, setNoMoreProjectMembers] = useState(false);
  const [lastProjectMember, setLastProjectMember] = useState(null);
  const { sendRequest } = useSendRequest();

  const [memberships, setMemberships] = useState([]);

  const searchMembers = debounce(async (query) => {
    let searchMembersURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/member/search?q=${query}`;

    if (currentMemberRole !== "All") {
      searchMembersURL += `&role=${currentMemberRole.toLowerCase()}`;
    }

    try {
      setIsLoading(true);
      const response = await sendRequest(searchMembersURL);
      if (response.status !== "success") {
        throw new Error(response.message);
      }

      const { memberships } = response.data;

      setMemberships(memberships);

      setIsLoading(false);
    } catch (err) {
      handleError(err);
    }
  }, 0.3);

  const onSearchBarChange = (event) => {
    const input = event.target.value;
    searchMembers(input);
  };

  useEffect(() => {
    if (noMoreProjectMembers) {
      return;
    }

    const getMoreProjectMembers = async () => {
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      let getProjectMembersURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/${project._id}/member?limit=${maxProjectMembersPerRequestLimit}&page=${getProjectMembersPage}`;

      if (currentMemberRole !== "All") {
        getProjectMembersURL += `&role=${currentMemberRole.toLowerCase()}`;
      }

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
    isInitialRender,
    currentMemberRole,
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

  const onDropdownOptionChange = (event) => {
    if (event.target.value === currentMemberRole) return;

    setGetProjectMembersPage(1);
    setNoMoreProjectMembers(false);
    setCurrentMemberRole(event.target.value);
    setMemberships([]);
  };

  const constantContext = useContext(ConstantContext);

  const memberRolesOption = constantContext.MEMBER_ROLES;

  const capitalizedMemberRolesOption = memberRolesOption.map((option) =>
    capitalizeFirstLetter(option)
  );
  capitalizedMemberRolesOption.unshift("All");

  const membersCountBasedOnRole = {
    all: 0,
    owner: 0,
    admin: 0,
    developer: 0,
  };

  const { membersCount } = project;

  membersCount.map((membersCountInfo) => {
    const role = membersCountInfo._id;
    membersCountBasedOnRole[role] = membersCountInfo.count;
    return null;
  });

  membersCountBasedOnRole.all = project.numberOfMembers;

  const membersStatRowOptions = Object.keys(membersCountBasedOnRole).map(
    (key) => {
      return { label: key, value: membersCountBasedOnRole[key] };
    }
  );

  return (
    <InProjectWithHeaderAndTaskStatRowLayout
      project={project}
      shouldDisplayNewTaskButton={false}
      dropDownOptions={capitalizedMemberRolesOption}
      dropDownOnChange={onDropdownOptionChange}
      statRowOptions={membersStatRowOptions}
    >
      <div className={classes.members__searchBarContainer}>
        <SearchBar onChange={onSearchBarChange} />
      </div>
      {memberships.length > 0 && (
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
      {isLoading && <Loading />}
      {!isLoading && (
        <NoDocumentsFound message="Unfortunately, it looks like we can not find any other members" />
      )}
    </InProjectWithHeaderAndTaskStatRowLayout>
  );
};

export default ProjectMembers;
