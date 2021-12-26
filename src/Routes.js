import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {rootPath, adminPath, adminRootPath, userPath} from "./path";
import {
    Dashboard,
    Users,
    Meetings,
    Attendances,
    Lecturers,
    Datasets,
    Students,
    Courses,
    Semesters,
    Schedules,
    Faculties,
    Departments,
    Roles
} from "./pages/Admin";
import {Home, Meeting, Attendance, Profile, TakePresence, EditAttendances} from "./pages";
import AdminRoute from "./components/AdminRoute";
import {MeetingDetails} from "./pages";

export const getAdminRoutes = () => (
    <Switch>
        <AdminRoute path={adminPath.dashboard} component={Dashboard}/>
        <AdminRoute path={adminPath.courses} component={Courses}/>
        <AdminRoute path={adminPath.meetings} component={Meetings}/>
        <AdminRoute path={adminPath.attendances} component={Attendances}/>
        <AdminRoute path={adminPath.datasets} component={Datasets}/>
        <AdminRoute path={adminPath.semesters} component={Semesters}/>
        <AdminRoute path={adminPath.schedules} component={Schedules}/>
        <AdminRoute path={adminPath.lecturers} component={Lecturers}/>
        <AdminRoute path={adminPath.students} component={Students}/>
        <AdminRoute path={adminPath.faculties} component={Faculties}/>
        <AdminRoute path={adminPath.departments} component={Departments}/>
        <AdminRoute path={adminPath.users} component={Users}/>
        <AdminRoute path={adminPath.roles} component={Roles}/>
        <Redirect from={rootPath} to={adminPath.dashboard}/>
        <Redirect from={adminRootPath} to={adminPath.dashboard}/>
    </Switch>
)

export const getRoutes = (props) => (
    <Switch>
        <Route path={userPath.home} component={Home}/>
        <Route exact path={userPath.meetings} component={Meeting}/>
        <Route path={userPath.meetingDetails} component={MeetingDetails}/>
        <Route path={userPath.meetingEditAttendances} component={EditAttendances}/>
        <Route path={userPath.meetingAttendances} component={TakePresence}/>
        <Route path={userPath.history} component={Attendance}/>
        <Route path={userPath.profile} component={Profile}/>
        <Redirect from={rootPath} to={userPath.home}/>
    </Switch>
)


