import { useParams } from "react-router-dom";
import InProjectNavbar from "../../Navbars/InProjectNavbar/InProjectNavbar.js";
import AuthPageLayout from "../AuthPageLayout/AuthPageLayout";

import classes from "./InProjectLayout.module.css";

const InProjectLayout = (props) => {
  const params = useParams();
  const projectId = params.id;

  return (
    <AuthPageLayout>
      <div className={classes.projectDashboard}>
        <InProjectNavbar props={projectId} />
        {props.children}
      </div>
    </AuthPageLayout>
  );
};

export default InProjectLayout;
