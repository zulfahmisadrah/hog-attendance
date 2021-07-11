import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Button, Card, Col, List, Row, Skeleton, Typography} from "antd";
import {EditOutlined, LogoutOutlined, UnlockOutlined} from "@ant-design/icons";
import {ProfileFormModal, ChangePasswordModal} from "./components";
import {showDataUpdatedNotification} from "../../utils/Commons";
import {removeAuth} from "../../services/auth"
import { getUserData } from '../../services';
const initialVisible = {password: false, edit: false}

function Profile() {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.auth.user.id);
    const role = useSelector(state => state.auth.user.role);

    const [data, setData] = useState([]);
    const [listData, setListData] = useState([{}, {}, {}]);
    const [visible, setVisible] = useState(initialVisible);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setLoading(true)
        getUserData(user => {
            setData(user)
            generateUserData(user)
        })
    };

    const handleLogout = () => {
        removeAuth();
        dispatch({type: "SET_LOGOUT"})
    };

    const onUpdateFinished = () => {
        fetchData()
        setVisible(prevState => ({...prevState, edit: false}))
        showDataUpdatedNotification("Profil berhasil diperbarui.")
    }

    const onChangePasswordFinished = () => {
        setVisible(prevState => ({...prevState, password: false}))
        showDataUpdatedNotification("Password berhasil diperbarui.")
    }

    const showModal = (type) => {
        setVisible(prevState => ({...prevState, [type]: true}));
    }

    const handleCancel = () => {
        setVisible(initialVisible);
    }

    const listTitleTeacher = {
        field: "Bidang",
        lastEducation: "Pendidikan Terakhir"
    }

    const listTitleStudent = {
        program: "Program",
        category: "Kelompok Ujian",
        school: "Asal Sekolah",
    }

    const listTitle = {
        phoneNumber: "No. HP",
        ... role === 3 ? listTitleTeacher : listTitleStudent
    }

    const generateUserData = (user) => {
        const userRoleName = role === 3 ? "teacher" : "student"
        const listDataKeys = role === 3 ? Object.keys(listTitleTeacher) : Object.keys(listTitleStudent)
        const userData = Object.keys(listTitle).map(key => ({
                title: listTitle[key],
                value: (listDataKeys.includes(key) ? user[userRoleName][key] : user[key]) ?? "-"
            })
        )
        setListData(userData)
        setLoading(false)
    }

    return (
        <div>
            <Card style={{margin: 16}}>
                <Skeleton loading={loading} active avatar={{shape: "square", size: 64}}>
                    <Row justify="space-between" align="middle">
                        <Col flex="80px">
                            <Avatar shape="square" size={64} src={data.photo}/>
                        </Col>
                        <Col flex="auto">
                            <Typography.Text strong>{data.name}</Typography.Text><br/>
                            <Typography.Text>{data.email}</Typography.Text><br/>
                        </Col>
                    </Row>
                    <Row justify="space-between" align="middle" style={{marginTop: 16}}>
                        <Button icon={<UnlockOutlined/>} onClick={() => showModal("password")}>Ubah Password</Button>
                        <Button type="primary" icon={<EditOutlined/>} onClick={() => showModal("edit")}>Edit
                            Profil</Button>
                    </Row>
                </Skeleton>
            </Card>
            <Card style={{margin: 16}}>
                <List
                    footer={!data.email ? <Skeleton.Button active/> :
                        <Button size="large" type="secondary" icon={<LogoutOutlined/>}
                                onClick={handleLogout}>Logout</Button>
                    }
                    itemLayout="horizontal"
                    dataSource={listData}
                    renderItem={item => {
                        return (
                            <List.Item key={item.title}>
                                <Skeleton loading={loading} active>
                                    <List.Item.Meta
                                        title={<Typography.Text>{item.title}</Typography.Text>}
                                        description={<Typography.Text strong>{item.value}</Typography.Text>}
                                    />
                                </Skeleton>
                            </List.Item>
                        )
                    }}
                />
            </Card>
            <ProfileFormModal title="Edit Profil" data={data} visible={visible.edit}
                              onSubmit={onUpdateFinished} onCancel={handleCancel}/>
            <ChangePasswordModal title="Ubah Password" visible={visible.password} onSubmit={onChangePasswordFinished}
                                 onCancel={handleCancel}/>
        </div>
    )
}

export default Profile;