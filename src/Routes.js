import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {rootPath, adminPath, adminRootPath, teacherPath} from "./path";
import {Dashboard, Users, Meetings, Attendances, Teachers} from "./pages/Admin";
import {Home, Meeting, Attendance, Profile, TakePresence} from "./pages";
import AdminRoute from "./components/AdminRoute";

export const getAdminRoutes = () => (
    <Switch>
        <AdminRoute path={adminPath.dashboard} component={Dashboard}/>
        <AdminRoute path={adminPath.meetings} component={Meetings}/>
        <AdminRoute path={adminPath.attendances} component={Attendances}/>
        <AdminRoute path={adminPath.teachers} component={Teachers}/>
        <AdminRoute path={adminPath.users} component={Users}/>
        <Redirect from={rootPath} to={adminPath.dashboard}/>
        <Redirect from={adminRootPath} to={adminPath.dashboard}/>
    </Switch>
)

export const getRoutes = () => (
    <Switch>
        <Route path={teacherPath.home} component={Home}/>
        <Route exact path={teacherPath.meetings} component={Meeting}/>
        <Route path={teacherPath.takePresence} component={TakePresence}/>
        <Route path={teacherPath.attendances} component={Attendance}/>
        <Route path={teacherPath.profile} component={Profile}/>
        <Redirect from={rootPath} to={teacherPath.home}/>
    </Switch>
)


