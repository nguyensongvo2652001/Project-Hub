import Card from "../UI/Card/Card";

import classes from "./StatBox.module.css";

const StatBox = (props) => {
  const { statInfo } = props;
  return (
    <Card className={classes.statBox}>
      <ion-icon
        name={statInfo.icon}
        style={{ color: statInfo.iconColor }}
      ></ion-icon>
      <h3>{statInfo.title}</h3>
      <p>{statInfo.value}</p>
    </Card>
  );
};

export default StatBox;
