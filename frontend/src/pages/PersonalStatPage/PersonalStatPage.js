import AuthPageLayout from "../../components/Layout/AuthPageLayout/AuthPageLayout.js";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import MyPieChart from "../../components/PieChart/MyPieChart";
import MyLineChart from "../../components/MyLineChart/MyLineChart";
import MyBarChart from "../../components/MyBarChart/MyBartChart";
import StatBox from "../../components/StatBox/StatBox";
import Loading from "../../components/UI/Loading/Loading";
import HighestCompletionRateProject from "./HighestCompletionRateProject";
import MostCompletedTasksProject from "./MostCompletedTasksProject";

import { useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";

import classes from "./PersonalStatPage.module.css";

const getFirstRowStatInfo = (tasksCountByStatus, totalProjectsJoined) => {
  return [
    {
      title: "TASKS COMPLETED",
      icon: "checkmark-circle-outline",
      iconColor: "#69DB7C",
      value: tasksCountByStatus.closed,
    },
    {
      title: "TASKS ASSIGNED",
      icon: "build-outline",
      iconColor: "#A8C1E5",
      value: tasksCountByStatus.total,
    },
    {
      title: "TASKS IN PROGRESS",
      icon: "sync-outline",
      iconColor: "#FAEFD0",
      value: tasksCountByStatus.doing,
    },
    {
      title: "TASKS OVERDUE",
      icon: "alert-circle-outline",
      iconColor: "#E8B0B1",
      value: tasksCountByStatus.overdue,
    },
    {
      title: "JOINED PROJECTS",
      icon: "documents-outline",
      iconColor: "#4DABF7",
      value: totalProjectsJoined,
    },
  ];
};

const convertResponseDataToChartData = (data) => {
  // The data: {"2025 5": 10, "2025 6": 12}
  // The converted data: [{ name: "May 2025", value: 10 }, { name: "June 2025", value: 12 }]
  const keys = Object.keys(data);
  const convertedData = [];
  keys.map((key) => {
    const [year, monthNumber] = key.split(" ");
    const name = `${monthNumber}/${year}`;
    convertedData.push({
      name,
      value: data[key],
    });

    return null;
  });
  return convertedData;
};

const PersonalStatPage = (props) => {
  const { sendRequest } = useSendRequest();
  const handleError = useErrorHandling();

  const [isLoading, setIsLoading] = useState(false);
  const [firstRowStatInfo, setFirstRowStatInfo] = useState([]);
  const [completionRatePieChartData, setCompletionRatePieChartData] = useState(
    []
  );
  const [completionRateLineChartData, setCompletionRateLineChartData] =
    useState([]);
  const [newlyCompletedTasksBarChartData, setNewlyCompletedTasksBarChartData] =
    useState([]);
  const [projectWithBestCompletionRate, setProjectWithBestCompletionRate] =
    useState(undefined);
  const [projectWithMostCompletedTasks, setProjectWithMostCompletedTasks] =
    useState(undefined);

  useEffect(() => {
    const getPersonalStat = async () => {
      const getPersonalStatURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/me/stat`;

      try {
        setIsLoading(true);
        const response = await sendRequest(getPersonalStatURL);

        if (response.status !== "success")
          throw new Error("something went wrong");

        const { stat } = response.data;

        const {
          tasksCountByStatus,
          projectStat,
          completionRateByMonthAndYear,
          newlyCompletedTasksByMonthAndYear,
        } = stat;

        const {
          totalProjectsJoined,
          projectWithBestCompletionRateInfo,
          projectWithMostCompletedTasksInfo,
        } = projectStat;

        const firstRowStatInfo = getFirstRowStatInfo(
          tasksCountByStatus,
          totalProjectsJoined
        );
        setFirstRowStatInfo(firstRowStatInfo);

        setCompletionRatePieChartData([
          {
            name: "Completed Tasks",
            value: stat.currentCompletionRate,
            color: "#246EAB",
          },
          {
            name: "Non-completed Tasks",
            value: 100 - stat.currentCompletionRate,
            color: "#4DABF7",
          },
        ]);

        let tempCompletionRateLineChartData = convertResponseDataToChartData(
          completionRateByMonthAndYear
        );
        setCompletionRateLineChartData(tempCompletionRateLineChartData);

        let tempNewlyCompletedTasksBarChartData =
          convertResponseDataToChartData(newlyCompletedTasksByMonthAndYear);

        setNewlyCompletedTasksBarChartData(tempNewlyCompletedTasksBarChartData);

        setProjectWithBestCompletionRate(projectWithBestCompletionRateInfo);
        setProjectWithMostCompletedTasks(projectWithMostCompletedTasksInfo);

        setIsLoading(false);
      } catch (err) {
        handleError(err);
      }
    };

    getPersonalStat();
  }, [handleError, sendRequest]);

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.personalStatPage}>
        {isLoading && <Loading className={classes.myProfilePage__loading} />}
        {!isLoading && (
          <>
            <ul className={classes.personalStatPage__firstRow}>
              {firstRowStatInfo.map((statInfo, index) => {
                return (
                  <li key={index}>
                    <StatBox statInfo={statInfo} />
                  </li>
                );
              })}
            </ul>

            <ul className={classes.personalStatPage__secondRow}>
              <li
                className={
                  classes.personalStatPage__completionRatePieChartContainer
                }
              >
                <MyPieChart
                  width={400}
                  height={300}
                  data={completionRatePieChartData}
                  className={classes.personalStatPage__completionRatePieChart}
                />
              </li>

              <li>
                <HighestCompletionRateProject
                  info={projectWithBestCompletionRate}
                />
              </li>

              <li>
                <MostCompletedTasksProject
                  info={projectWithMostCompletedTasks}
                />
              </li>
            </ul>

            <div
              className={
                classes.personalStatPage__completionRateLineChartContainer
              }
            >
              <MyLineChart
                data={completionRateLineChartData}
                width={500}
                height={300}
                label="Completion rate (%)"
                color="#4DABF7"
                title="Your average completion rate in the last 12 months"
              />
            </div>

            <div className={classes.personalStatPage__barChartContainer}>
              <MyBarChart
                data={newlyCompletedTasksBarChartData}
                barColor="#4DABF7"
                label="number of newly completed tasks"
                width="100%"
                height={300}
                title="Number of newly completed tasks"
              />
            </div>
          </>
        )}
      </div>
    </AuthPageLayout>
  );
};

export default PersonalStatPage;
