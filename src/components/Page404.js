import React from 'react';
import {Button, Result} from "antd";
import {useHistory} from "react-router-dom";
import {bottomNavPath} from "../path";

function Page404() {
    const history = useHistory()

    return (
        <Result
            status="404"
            title="Fitur Belum Tersedia"
            subTitle="Fitur ini masih dalam tahap pengembangan."
            extra={<Button type="primary" onClick={() => history.replace(bottomNavPath.home)}>Halaman Utama</Button>}
        />
    )
}

export default Page404;