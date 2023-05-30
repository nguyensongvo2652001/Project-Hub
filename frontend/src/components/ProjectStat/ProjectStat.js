import InProjectLayout from "../Layout/InProjectLayout/InProjectLayout";
import MyPieChart from "../../components/PieChart/MyPieChart";
import MyLineChart from "../../components/MyLineChart/MyLineChart";
import MyBarChart from "../../components/MyBarChart/MyBartChart";
import StatBox from "../../components/StatBox/StatBox";
import Loading from "../../components/UI/Loading/Loading";

import { useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";

import { convertNumberToMonthName } from "../../utils/date";

import classes from "./ProjectStat.module.css";

const getFirstRowStatInfo = (tasksCountByStatus) => {
  return [
    {
      title: "TASKS COMPLETED",
      icon: "checkmark-circle-outline",
      iconColor: "#69DB7C",
      value: tasksCountByStatus.closed || 0,
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
      value: tasksCountByStatus.doing || 0,
    },
    {
      title: "TASKS OVERDUE",
      icon: "alert-circle-outline",
      iconColor: "#E8B0B1",
      value: tasksCountByStatus.overdue || 0,
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
    const monthName = convertNumberToMonthName(monthNumber);
    const name = `${monthName} ${year}`;
    convertedData.push({
      name,
      value: data[key],
    });

    return null;
  });
  return convertedData;
};

const ProjectStat = (props) => {
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

  useEffect(() => {
    const getProjectStat = async () => {
      const getProjectStatURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/project/64644f24d72808f7e85af670/stat`;

      try {
        setIsLoading(true);
        const response = await sendRequest(getProjectStatURL);

        if (response.status !== "success")
          throw new Error("something went wrong");

        const { stat } = response.data;

        const {
          tasksStat,
          completionRate,
          projectCompletionRateByMonthAndYear,
          newlyCompletedTasksCountByMonthAndYear,
        } = stat;

        const firstRowStatInfo = getFirstRowStatInfo(tasksStat);
        setFirstRowStatInfo(firstRowStatInfo);

        setCompletionRatePieChartData([
          {
            name: "Completed Tasks",
            value: completionRate,
            color: "#246EAB",
          },
          {
            name: "Non-completed Tasks",
            value: 100 - completionRate,
            color: "#4DABF7",
          },
        ]);

        let tempCompletionRateLineChartData = convertResponseDataToChartData(
          projectCompletionRateByMonthAndYear
        );
        setCompletionRateLineChartData(tempCompletionRateLineChartData);

        let tempNewlyCompletedTasksBarChartData =
          convertResponseDataToChartData(
            newlyCompletedTasksCountByMonthAndYear
          );

        setNewlyCompletedTasksBarChartData(tempNewlyCompletedTasksBarChartData);

        setIsLoading(false);
      } catch (err) {
        handleError(err);
      }
    };

    getProjectStat();
  }, [handleError, sendRequest]);

  return (
    <InProjectLayout>
      <div className={classes.projectStat}>
        {isLoading && <Loading className={classes.myProfilePage__loading} />}
        {!isLoading && (
          <>
            <ul className={classes.projectStat__firstRow}>
              {firstRowStatInfo.map((statInfo, index) => {
                return (
                  <li key={index}>
                    <StatBox statInfo={statInfo} />
                  </li>
                );
              })}
            </ul>

            <ul className={classes.projectStat__secondRow}>
              <li
                className={classes.projectStat__completionRatePieChartContainer}
              >
                <MyPieChart
                  width={400}
                  height={300}
                  data={completionRatePieChartData}
                  className={classes.projectStat__completionRatePieChart}
                  title="Completion rate pie chart"
                  titleColor="#4DABF7"
                />
              </li>
            </ul>

            <div
              className={classes.projectStat__completionRateLineChartContainer}
            >
              <MyLineChart
                data={completionRateLineChartData}
                width="100%"
                height={300}
                label="Completion rate (%)"
                color="#4DABF7"
                title="Project average completion rate in the last 12 months"
              />
            </div>

            <div className={classes.projectStat__barChartContainer}>
              <MyBarChart
                data={newlyCompletedTasksBarChartData}
                barColor="#4DABF7"
                label="number of newly completed tasks"
                width="100%"
                height={300}
                title="Number of newly completed tasks in the last 12 months"
              />
            </div>
          </>
        )}
      </div>
    </InProjectLayout>
  );
};

export default ProjectStat;
