import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Button, Card, Col, List, Row, Skeleton, Typography} from "antd";
import {EditOutlined, LogoutOutlined, UnlockOutlined} from "@ant-design/icons";
import {ProfileFormModal, ChangePasswordModal, StudentDatasetsModal} from "./components";
import {handleInputPhoneNumber, showDataUpdatedMessage} from "../../utils/Commons";
import {removeAuth} from "../../services/auth"
import {UserService} from "../../services/services/UserService";
import {ButtonFormModal, ButtonShowModal} from "../../components";
import {BASE_AVATAR_URL} from "../../utils/Constants";

const initialVisible = {password: false, edit: false}

export function Profile() {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.auth.user.id);
    const username = useSelector(state => state.auth.user.username);
    const role = useSelector(state => state.auth.user.role);

    const [data, setData] = useState([]);
    const [listData, setListData] = useState([{}, {}, {}]);
    const [visible, setVisible] = useState(initialVisible);
    const [loading, setLoading] = useState(false);

    const userService = new UserService();

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        setLoading(true)
        userService.getData({
            id: userId,
            onSuccess: (user) => {
                setData(user)
                generateUserData(user)
            }
        })
    }

    const handleLogout = () => {
        removeAuth();
        dispatch({type: "SET_LOGOUT"})
    }

    const handleUpdateProfile = (values, onSuccess, onError, origin) => {
        values.phone_number = values.phone_number ? handleInputPhoneNumber(values.phone_number) : values.phone_number;
        if (values.fileList) {
            const file = values.fileList[0]?.originFileObj;
            const avatarFormData = new FormData();
            avatarFormData.append('username', username);
            avatarFormData.append('avatar', file);
            if (values.id) {
                const avatarUrl = BASE_AVATAR_URL + origin.avatar;
                const avatarModified = values.fileList[0]?.thumbUrl !== avatarUrl;
                delete values.fileList;
                if (file && avatarModified) {
                    userService.uploadUserAvatar({
                        data: avatarFormData,
                        onSuccess: (filePath) => {
                            values.avatar = filePath
                            updateUser(values, onSuccess, onError);
                        }
                    });
                } else {
                    values.avatar = null;
                    updateUser(values, onSuccess, onError);
                }
            }
        }
    }

    const updateUser = (values, onSuccess, onError) => {
        userService.updateMyData({
            data: values,
            onSuccess: (updatedData) => {
                onSuccess();
                showDataUpdatedMessage("Profil berhasil diperbarui.")
                fetchData();
            },
            onError: (error) => {
                onError(error);
            },
        })
    }

    const onChangePasswordFinished = () => {
        setVisible(prevState => ({...prevState, password: false}))
        showDataUpdatedMessage("Password berhasil diperbarui.")
    }

    const showModal = (type) => {
        setVisible(prevState => ({...prevState, [type]: true}));
    }

    const handleCancel = () => {
        setVisible(initialVisible);
    }

    const listTitleTeacher = {
        nip: "NIP",
        last_education: "Pendidikan Terakhir"
    }

    const listTitleStudent = {
        year: "Angkatan",
    }

    const listTitle = {
        email: "Email",
        phone_number: "No. HP",
        ...role === 3 ? listTitleTeacher : listTitleStudent
    }

    const generateUserData = (user) => {
        const userRoleName = role === 3 ? "lecturer" : "student"
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
                            <Avatar shape="square" size={64} src={BASE_AVATAR_URL + data.avatar}/>
                        </Col>
                        <Col flex="auto">
                            <Typography.Text strong>{data.name}</Typography.Text><br/>
                            <Typography.Text>{data.username}</Typography.Text><br/>
                        </Col>
                    </Row>
                    <Row justify="end" align="middle" style={{marginTop: 16}} gutter={[16, 8]}>
                        <Col xs={12} md={6}>
                            <Button className="w-100" icon={<UnlockOutlined/>} onClick={() => showModal("password")}>
                                Ubah Password
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <ButtonFormModal
                                data={data}
                                title="Edit Profil"
                                formModal={ProfileFormModal}
                                icon={<EditOutlined/>}
                                onSubmit={handleUpdateProfile}
                                className="w-100"
                            >
                                Edit Profil
                            </ButtonFormModal>
                        </Col>
                        <Col xs={24} md={12}>
                            <ButtonShowModal modal={StudentDatasetsModal} type="primary" className="w-100">
                                Upload Dataset
                            </ButtonShowModal>
                        </Col>
                    </Row>
                </Skeleton>
            </Card>
            <Card style={{margin: 16}}>
                <List
                    footer={!data.username ? <Skeleton.Button active/> :
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
            <ChangePasswordModal title="Ubah Password" visible={visible.password} onSubmit={onChangePasswordFinished}
                                 onCancel={handleCancel}/>
        </div>
    )
}
