import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Box } from "@mui/system";
import LoginContext from "../LoginContext";
import Admin from "../Admin";
import Interviewer from "../Interviewer";
import Recruiter from "../Recruiter";

// const hrPages = [
//   { title: "Dashboard", path: "/Dashboard", icon: <QueryStatsIcon /> },
//   {
//     title: "Posted Jobs",
//     path: "/Dashboard/posted-jobs",
//     icon: <ViewTimelineIcon />,
//   },
//   {
//     title: "Scheduled Interviews",
//     path: "/Dashboard/viewInterviewStatus/0",
//     icon: <AssignmentOutlinedIcon />,
//   },
//   {
//     title: "Scheduled All",
//     path: "/Dashboard/view-all-interviews",
//     icon: <EventAvailableOutlinedIcon />,
//   },
//   {
//     title: "Recuriters",
//     path: "/Dashboard/recruiters",
//     icon: <EventAvailableOutlinedIcon />,
//   },
// ];

// const recruiterPages = [
//   {
//     title: "Dashboard",
//     path: "/Dashboard",
//     icon: <QueryStatsIcon />,
//   },
//   {
//     title: "Candidates",
//     path: "/Dashboard/Candidates",
//     icon: <PeopleAltOutlinedIcon />,
//   },
//   {
//     title: "Assigned Tasks",
//     path: "/Dashboard/assignedTasks/57",
//     icon: <AssignmentOutlinedIcon />,
//   },
//   {
//     title: "Scheduled Interviews",
//     path: "/Dashboard/scheduled-interviews/57",
//     icon: <EventAvailableOutlinedIcon />,
//   },
// ];

export default function Dashboard() {
  const { roles } = useContext(LoginContext);

  useEffect(() => {
    console.log(roles);
  }, []);

  return (
    <>
      {/* <CustomDrawer
        pages={user.role === "hr_manager" ? hrPages : recruiterPages}
      /> */}
      <Box sx={{ mt: 5, ml: 8 }}>
        {roles.includes("admin") && (
          <Routes>
            <Route path="" element={<Admin />} />
          </Routes>
        )}
        {roles.includes("interviewers") && (
          <Routes>
            <Route path="" element={<Interviewer />} />
          </Routes>
        )}
        {roles.includes("recruiter") && (
          <Routes>
            <Route path="" element={<Recruiter />} />
          </Routes>
        )}
      </Box>
    </>
  );
}
