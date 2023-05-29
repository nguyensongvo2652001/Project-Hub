import CardMetaInfo from "../UI/CardMetaInfo/CardMetaInfo.js";
import ProjectMainInfo from "../UI/ProjectMainInfo/ProjectMainInfo.js";

import classes from "./Project.module.css";

import { getDateDisplay } from "../../utils/date";
import Card from "../UI/Card/Card.js";

const Project = (props) => {
  const { project, lastProjectElement } = props; //lastProjectElement can be undefined if the project is not the last project for display

  let descriptionDisplay = project.description || "";
  if (descriptionDisplay.length > 120) {
    descriptionDisplay = descriptionDisplay.slice(0, 117) + "...";
  }

  const lastChangeDisplayDate = getDateDisplay(project.lastChanged);
  const displayCreatedAtDate = getDateDisplay(project.dateCreated);

  const metaInfoList = [
    {
      title: "Last change: ",
      value: lastChangeDisplayDate,
    },
    {
      title: "Created at",
      value: displayCreatedAtDate,
    },
  ];

  return (
    <li ref={lastProjectElement}>
      <Card className={classes.project}>
        <ProjectMainInfo project={project} />

        <CardMetaInfo metaInfoList={metaInfoList} />
      </Card>
    </li>
  );
};

export default Project;
