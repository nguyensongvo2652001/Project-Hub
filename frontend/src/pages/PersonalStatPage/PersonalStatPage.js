import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";
import MyPieChart from "../../components/PieChart/MyPieChart";
import MyLineChart from "../../components/MyLineChart/MyLineChart";
import ProjectMainInfo from "../../components/Project/ProjectMainInfo";
import MyBarChart from "../../components/MyBarChart/MyBartChart";
import Card from "../../components/UI/Card/Card";
import StatBox from "../../components/StatBox/StatBox";
import Loading from "../../components/UI/Loading/Loading";

import { useEffect, useState } from "react";
import useSendRequest from "../../hooks/useSendRequest";
import useErrorHandling from "../../hooks/useErrorHandling";

import classes from "./PersonalStatPage.module.css";
import { convertNumberToMonthName } from "../../utils/date";

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

  // let completionRateLineChartData = [
  //   { name: "Jan", value: 10 },
  //   { name: "Feb", value: 20 },
  //   { name: "Mar", value: 15 },
  //   { name: "Apr", value: 30 },
  //   { name: "May", value: 40 },
  //   { name: "June", value: 100 },
  //   { name: "Jul", value: 20 },
  //   { name: "Sep", value: 15 },
  //   { name: "Oct", value: 35 },
  //   { name: "Nov", value: 72 },
  //   { name: "Dec", value: 90 },
  // ];

  let newlyCompletedTasksBarChartData = [
    { name: "A", value: 100 },
    { name: "B", value: 200 },
    { name: "C", value: 150 },
    { name: "D", value: 300 },
    { name: "E", value: 400 },
    { name: "A", value: 100 },
    { name: "B", value: 200 },
    { name: "C", value: 150 },
    { name: "D", value: 300 },
    { name: "E", value: 400 },
    { name: "D", value: 300 },
    { name: "E", value: 400 },
  ];

  useEffect(() => {
    const getPersonalStat = async () => {
      const getPersonalStatURL = `${process.env.REACT_APP_BACKEND_BASE_URL}/me/stat`;

      try {
        setIsLoading(true);
        const response = await sendRequest(getPersonalStatURL);

        if (response.status !== "success")
          throw new Error("something went wrong");

        const { data } = response;
        const { stat } = data;
        const {
          tasksCountByStatus,
          projectStat,
          completionRateByMonthAndYear,
        } = stat;
        const { totalProjectsJoined } = projectStat;

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

        let tempCompletionRateLineChartData = [];
        const monthAndYear = Object.keys(completionRateByMonthAndYear);
        monthAndYear.map((key) => {
          const [year, monthNumber] = key.split(" ");
          const monthName = convertNumberToMonthName(monthNumber);
          const name = `${monthName} ${year}`;
          tempCompletionRateLineChartData.push({
            name,
            value: completionRateByMonthAndYear[key],
          });

          return null;
        });

        setCompletionRateLineChartData(tempCompletionRateLineChartData);

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
                <Card className={classes.highestCompletionRateProject}>
                  <div>
                    <div
                      className={classes.highestCompletionRateProject__title}
                    >
                      <ion-icon name="ribbon-outline"></ion-icon>
                      <p>Project with highest completion rate</p>
                    </div>
                    <ProjectMainInfo
                      mainInfo={{
                        name: "GeoMap",
                        tag: "Mobile",
                        description:
                          "An Android app that helps you with running.",
                      }}
                    />
                  </div>
                  <div
                    className={
                      classes.highestCompletionRateProject__completionRateBarContainer
                    }
                  >
                    <p className={classes.highestCompletionRateProject__label}>
                      Completion Rate
                    </p>
                    <div className={classes.completionRateChart}>
                      <div className={classes.completionRateBar}>
                        <div className={classes.emptyBar}></div>
                        <div
                          className={classes.fillBar}
                          style={{ width: "80%" }}
                        ></div>
                      </div>

                      <p className={classes.completionRateBarValue}>80%</p>
                    </div>
                  </div>
                </Card>
              </li>

              <li>
                <Card className={classes.mostCompletedTasksProject}>
                  <div className={classes.mostCompletedTasksProject__title}>
                    <ion-icon name="trophy-outline"></ion-icon>
                    <p>Most completed tasks project</p>
                  </div>
                  <ProjectMainInfo
                    mainInfo={{
                      name: "GeoMap",
                      tag: "Mobile",
                      description:
                        "An Android app that helps you with running.",
                    }}
                  />
                  <div
                    className={
                      classes.mostCompletedTasksProject__semiDonutContainer
                    }
                  >
                    <p className={classes.mostCompletedTasksProject__label}>
                      Number of completed tasks
                    </p>
                    <div className={classes.completedTasksChart}>
                      <div
                        className={classes.semiDonut}
                        style={{ "--percentage": 80 }}
                      ></div>
                      <p className={classes.semiDonut__value}>
                        <span>75</span> of 120 assigned tasks
                      </p>
                    </div>
                  </div>
                </Card>
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
