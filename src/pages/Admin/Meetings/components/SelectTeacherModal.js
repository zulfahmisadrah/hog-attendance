import React, {useState} from "react";
import {Form, Modal} from "antd";
import Lecturers from "../../Lecturers";

function SelectTeacherModal(props) {
    const {data, title, visible, onSubmit, onCancel} = props;
    const [selectedTeachers, setSelectedTeachers] = useState({});
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const handleOk = () => {
        setConfirmLoading(true);
        onSubmit(selectedTeachers)
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        if (data !== undefined) form.resetFields();
        onCancel();
    }

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            okText="Pilih"
            cancelText="Batal"
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            width={1050}
            centered
            bodyStyle={{height: '600px', overflowY: 'auto'}}
        >
            <Lecturers isSelectDataMode onDataSelected={setSelectedTeachers}/>
        </Modal>
    )
}

export default SelectTeacherModal;