import React, {useState} from 'react';
import {Link as LinkRouter} from 'react-router-dom'
import {loginPath} from "../path";
import {Alert, Button, Card, Col, Divider, Form, Input, Row, Typography, Space, Select} from "antd";
import styled from 'styled-components';
import {getImage} from "../assets/images";

const { Text } = Typography;

const styles = {
    backgroundColor: '#f8f8f8'
}

const StyledRow = styled(Row)`
    height: 100vh;
    justify-content: center;
    align-items: center;
    .logo{
        width: 20%;
        align-self: center;
    },
    .input{
        padding: .5em;
        border-radius: 4px;
    },
    .ant-form-item{
        margin-bottom: 16px;
    },
    .ant-divider{
        margin: 10px 0;
    }
    .login-form-button {
        width: 100%;
        height: auto;
        padding: .5em;
        border-radius: 5px;
    },
    .alert{
        margin-bottom: 5px;
    }
`

const StyledCard = styled(Card)`
    width: 100%;
    border-radius: .25rem;
    box-shadow: 2px 6px 15px 0 rgba(69,65,78,.1);
    .card-header{
        display: flex;
        justify-content: center;
    }
`

function Register() {
    let [messages, setMessages] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const registerUser = (values) => {
        // auth.createUserWithEmailAndPassword(values.email, values.password)
        //     .then((credential) => {
        //         const user = credential.user
        //         user.sendEmailVerification().then(() => {
        //             values.role = 4
        //             setMessages({success: "Pendaftaran berhasil. Silakan cek email Anda untuk melakukan verifikasi akun."})
        //             const currentTime = getCurrentDateTime();
        //             const newUser = new User(values)
        //             newUser.createdAt = currentTime
        //             newUser.updatedAt = currentTime
        //             db.collection(DB_USERS).doc(user.uid).withConverter(userConverter).set(newUser).then(() => {
        //                 auth.signOut()
        //                 setIsLoading(false)
        //             }).catch((error) => {
        //                 console.error("Error adding document: ", error);
        //                 setIsLoading(false)
        //             })
        //         })
        //     }).catch((error) => {
        //         console.log("Error creating user: ", error)
        //         switch (error.code){
        //             case "auth/email-already-in-use": setMessages({error: "Email telah terdaftar"}); break;
        //             default: setMessages({error: error.message});
        //         }
        //         setIsLoading(false)
        //     });
    }

    const onFinish = (values) => {
        setIsLoading(true);
        registerUser(values)
    }

    return (
        <div style={styles}>
            <StyledRow>
                <Col xs={20} lg={12}>
                    <StyledCard>
                        <div className="card-header">
                            <img className="logo" src={getImage('logoDark')} alt="logo"/>
                        </div>
                        <Divider/>
                        <div>
                            <Form
                                name="normal_login"
                                className="login-form"
                                layout={"vertical"}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                            >
                                {messages.error ? (
                                    <Alert className="alert" message={messages.error} type="error"/>
                                ) : null}
                                {messages.success ? (
                                    <Alert className="alert" message={messages.success} type="success"/>
                                ) : null}
                                <Row gutter={[20,0]}>
                                    <Col xs={{span: 24}} lg={{span: 12}}>
                                        <Form.Item
                                            name="name"
                                            label="Nama"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Masukkan nama Anda',
                                                    whitespace: true,
                                                },
                                            ]}
                                        >
                                            <Input className="input" placeholder="Name"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 24}} lg={{span: 12}}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[
                                                {
                                                    type: 'email',
                                                    message: 'Email tidak valid',
                                                },
                                                {
                                                    required: true,
                                                    message: 'Masukkan email Anda',
                                                },
                                            ]}
                                        >
                                            <Input className="input" placeholder="Email"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 24}} lg={{span: 12}}>
                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            rules={[
                                                {
                                                    min: 6,
                                                    message: 'Password minimal 6 karakter',
                                                },
                                                {
                                                    required: true,
                                                    message: 'Masukkan password Anda',
                                                },
                                            ]}
                                        >
                                            <Input.Password className="input" placeholder="Password"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={{span: 24}} lg={{span: 12}}>
                                        <Form.Item
                                            name="confirmPassword"
                                            label="Konfirmasi Password"
                                            dependencies={['password']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Konfirmasi password Anda',
                                                },
                                                ({getFieldValue}) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Password tidak sesuai')
                                                    }
                                                })
                                            ]}
                                        >
                                            <Input.Password className="input" placeholder="Confirm Password"/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Divider/>
                                <Row justify="center">
                                    <Col xs={{span: 24, order: 2}} lg={{span: 16, order: 1}}>
                                        <Space align="center">
                                            <Text>Sudah memiliki akun? </Text>
                                            <LinkRouter to={loginPath}>Masuk di sini!</LinkRouter>
                                        </Space>
                                    </Col>
                                    <Col xs={{span: 24, order: 1}} lg={{span: 6, order: 2}}>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" className="login-form-button"
                                                    loading={isLoading}>
                                                Daftar
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </StyledCard>
                </Col>
            </StyledRow>
        </div>
    );
}

export default Register;
