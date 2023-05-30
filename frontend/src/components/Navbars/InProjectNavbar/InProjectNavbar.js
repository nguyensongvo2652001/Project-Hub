import { useParams } from "react-router-dom";
import NavItem from "../NavItem/NavItem";
import classes from "./InProjectNavbar.module.css";

const InProjectNavbar = (props) => {
  const { id: projectId } = useParams();

  return (
    <div className={classes.inProjectNavbar}>
      <ul className={classes.inProjectNavbar__navbarList}>
        <NavItem item={{ text: "Dashboard", link: `/projects/${projectId}` }} />
        <NavItem
          item={{ text: "Settings", link: `/projects/${projectId}/settings` }}
        />
        <NavItem
          item={{ text: "Members", link: `/projects/${projectId}/members` }}
        />
        <NavItem
          item={{ text: "Statistic", link: `/projects/${projectId}/stat` }}
        />
        <NavItem
          item={{
            text: "Notifications",
            link: `/projects/${projectId}/notifications`,
          }}
        />
      </ul>
    </div>
  );
};

export default InProjectNavbar;
