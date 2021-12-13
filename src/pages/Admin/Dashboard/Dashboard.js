import React from 'react';
import {useSelector} from "react-redux";
import {Card, Typography} from "antd";

export function Dashboard(){
    const username = useSelector(state => state.auth.user.name);

    return (
        <Card>
            <h1>Dashboard</h1>
            <Typography.Text strong>Halo, {username}</Typography.Text>
        </Card>
    );

}