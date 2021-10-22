import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {rootPath, adminPath, adminRootPath, teacherPath} from "./path";
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
import {Home, Meeting, Attendance, Profile, TakePresence, MeetingAttendances} from "./pages";
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

export const getRoutes = () => (
    <Switch>
        <Route path={teacherPath.home} component={Home}/>
        <Route exact path={teacherPath.meetings} component={Meeting}/>
        <Route path={teacherPath.meetingDetails} component={MeetingDetails}/>
        <Route path={teacherPath.meetingEditAttendances} component={MeetingAttendances}/>
        <Route path={teacherPath.meetingAttendances} component={TakePresence}/>
        <Route path={teacherPath.history} component={Attendance}/>
        <Route path={teacherPath.profile} component={Profile}/>
        <Redirect from={rootPath} to={teacherPath.home}/>
    </Switch>
)


