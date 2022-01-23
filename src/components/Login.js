import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {adminRootPath, rootPath} from "../path";
import {Alert, Button, Card, Col, Divider, Form, Input, Row} from "antd";
import styled from 'styled-components';
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import {showErrorModal} from "../utils/Commons";
import {removeAuth, storeAuth} from "../services/auth"
import {authLogin, fetchUserData} from '../services/client';
import {useDispatch} from 'react-redux';
import {APP_NAME} from "../utils/Constants";

const styles = {
    backgroundColor: '#f8f8f8'
}

const StyledRow = styled(Row)`
    height: 100vh;
    justify-content: center;
    align-items: center;
    .card-header{
        margin-bottom: 16px;
    }
    .logo{
        width: 70%;
        align-self: center;
    }
    .input{
        padding: .7em;
        border-radius: 4px;
    }
    .ant-form-item{
        margin-bottom: 16px;
    }
    .ant-divider{
        margin: 0 0;
    }
    .login-form-button {
        width: 100%;
        height: auto;
        padding: .7em;
        border-radius: 5px;
    }
    .alert{
        margin-bottom: 5px;
    }
`

const StyledCard = styled(Card)`
    min-width: 320px;
    max-width: 340px;
    border-radius: .25rem;
    box-shadow: 2px 6px 15px 0 rgba(69,65,78,.1);
    .card-header{
        display: flex;
        justify-content: center;
    }
`

function Login() {
    const dispatch = useDispatch();
    let history = useHistory();

    let [messages, setMessages] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = (values) => {
        authLogin(values).then( res => {
            const userAuthData = res.data
            storeAuth(userAuthData)
            fetchUserData().then(userData => {
                const user = userData.data
                if (user.is_active) {
                    const userRole = user.roles[0].id
                    const payload = {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        role: userRole
                    }
                    dispatch({type: "SET_LOGIN", payload: payload})
                    setIsLoading(false)
                    const destination = userRole < 3 ? adminRootPath : rootPath
                    history.push(destination)
                } else {
                    removeAuth()
                    setMessages({
                        emailNotVerified: (
                            <div>Anda belum melakukan verifikasi email. Silakan cek email Anda.<br/><br/>Atau<Button
                                type="link" size="small">Klik disini</Button>untuk mengirim ulang email verifikasi.
                            </div>)
                    })
                    setIsLoading(false)
                }
            })
            .catch(e => {
                console.log(e)
                showErrorModal(e)
                setIsLoading(false)
            })
        }).catch(e => {
            setMessages({
                error: e.response?.data?.detail
            })

            // showErrorModal(e.message)
            console.log(e.response)
            setIsLoading(false)
        })
    }

    const onFinish = (values) => {
        setIsLoading(true);
        loginUser(values)
    }

    return (
        <div style={styles}>
            <StyledRow>
                <Col>
                    <StyledCard>
                        <div className="card-header">
                            <h2>{APP_NAME}</h2>
                        </div>
                        <Divider/>
                        <div>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                            >
                                {messages.error ? (
                                    <Alert className="alert" message={messages.error} type="error"/>
                                ) : null}
                                {messages.emailNotVerified ? (
                                    <Alert className="alert" message={messages.emailNotVerified} type="error"/>
                                ) : null}
                                {messages.success ? (
                                    <Alert className="alert" message={messages.success} type="success"/>
                                ) : null}
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Masukkan Username Anda',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="site-form-item-icon"/>}
                                        className="input"
                                        placeholder="Username"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Masukkan password Anda',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon"/>}
                                        className="input"
                                        placeholder="Password"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button"
                                            loading={isLoading}>
                                        Masuk
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </StyledCard>
                </Col>
            </StyledRow>
        </div>
    );
}

export default Login;
