import React from 'react';
import {Layout, Row, Typography} from "antd";
import MeetingList from "../../Meeting/components/MeetingList";

function Menu() {

    return (
        <Layout style={{paddingTop: 16}}>
            <Row>
                <Typography.Title level={5} style={{
                    fontFamily: `'Poppins', sans-serif`,
                    fontWeight: 800,
                    margin: "0 16px"
                }}>
                    Pertemuan Terdekat
                </Typography.Title>
            </Row>
            <MeetingList type="nearest" limit={1}/>
        </Layout>
    )
}

export default Menu;