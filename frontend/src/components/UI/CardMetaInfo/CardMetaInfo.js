import classes from "./CardMetaInfo.module.css";

const CardMetaInfo = (props) => {
  return (
    <ul className={classes.metaInfoContainer}>
      {props.metaInfoList.map((metaInfo, index) => {
        return (
          <li className={classes.metaInfo} key={index}>
            <h3>{metaInfo.title} </h3>
            <p>{metaInfo.value}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default CardMetaInfo;
