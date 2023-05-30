import classes from "./CardMetaInfo.module.css";

const CardMetaInfo = (props) => {
  const allClasses = `${classes.metaInfoContainer} ${props.className}`;

  return (
    <ul className={allClasses}>
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
