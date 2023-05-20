import AuthPageLayout from "../../components/Layout/AuthPageLayout";
import SearchBarContainer from "../../components/SearchBar/SearchBarContainer";

import classes from "./PersonalStatPage.module.css";
import { Backdrop } from "../../components/UI/Modal/Modal";
import Loading from "../../components/UI/Loading/Loading";
import { useState } from "react";
import Card from "../../components/UI/Card/Card";
import StatBox from "../../components/StatBox/StatBox";

import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import MyPieChart from "../../components/PieChart/MyPieChart";
import MyLineChart from "../../components/MyLineChart/MyLineChart";
import ProjecTag from "../../components/UI/ProjectTag/ProjectTag";

const PersonalStatPage = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const firstRowStatBoxInfo = [
    {
      title: "TASKS COMPLETED",
      icon: "checkmark-circle-outline",
      iconColor: "#69DB7C",
      value: 20,
    },
    {
      title: "TASKS ASSIGNED",
      icon: "build-outline",
      iconColor: "#A8C1E5",
      value: 45,
    },
    {
      title: "TASKS IN PROGRESS",
      icon: "sync-outline",
      iconColor: "#FAEFD0",
      value: 10,
    },
    {
      title: "TASKS OVERDUE",
      icon: "alert-circle-outline",
      iconColor: "#E8B0B1",
      value: 2,
    },
    {
      title: "JOINED PROJECTS",
      icon: "documents-outline",
      iconColor: "#4DABF7",
      value: 2,
    },
  ];

  const completionRatePieChartData = [
    { name: "Completed Tasks", value: 44, color: "#246EAB" },
    { name: "Non-completed Tasks", value: 56, color: "#4DABF7" },
  ];

  const completionRateLineChartData = [
    { name: "Jan", value: 10 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 30 },
    { name: "May", value: 40 },
    { name: "June", value: 100 },
    { name: "Jul", value: 20 },
    { name: "Sep", value: 15 },
    { name: "Oct", value: 35 },
    { name: "Nov", value: 72 },
    { name: "Dec", value: 90 },
  ];

  return (
    <AuthPageLayout>
      <SearchBarContainer />
      <div className={classes.personalStatPage}>
        {isLoading && (
          <div className={classes.myProfilePage__loadingContainer}>
            <Loading className={classes.myProfilePage__loading} />
            <Backdrop />
          </div>
        )}
        <ul className={classes.personalStatPage__firstRow}>
          {firstRowStatBoxInfo.map((statInfo, index) => {
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
              width={300}
              height={400}
              data={completionRatePieChartData}
              className={classes.personalStatPage__completionRatePieChart}
            />
          </li>

          <li>
            <MyLineChart
              data={completionRateLineChartData}
              width={500}
              height={300}
              label="Completion rate (%)"
              color="#4DABF7"
            />
          </li>

          <li>
            <Card>
              <div>
                <ion-icon name="ribbon-outline"></ion-icon>
                <p>Project with highest completion rate</p>
              </div>
              <p>GeoMap</p>
              <ProjecTag tag="Mobile" />
            </Card>
          </li>
        </ul>
        <ul className={classes.personalStatPage__thirdRow}></ul>
      </div>
    </AuthPageLayout>
  );
};

export default PersonalStatPage;
