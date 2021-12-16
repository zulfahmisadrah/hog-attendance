import React, {useState} from "react";
import {Button} from "antd";
import {CourseService} from "../../../../services/services";
import {DataTableModal} from "./DataTableModal";
import {ColumnActionDelete} from "../../../../components/ColumnActionDelete";
import PropTypes from "prop-types";
import StudentRequest from "../../../../services/endpoints/students";
import {BASE_API_STUDENTS} from "../../../../services/endpoints/_constants";
import {showDataDeletedNotification, showDataUpdatedNotification} from "../../../../utils/Commons";

ButtonShowStudents.propTypes = {
    course: PropTypes.object.isRequired
}

export function ButtonShowStudents(props) {
    const {course} = props

    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);

    const courseService = new CourseService();
    const studentRequest = new StudentRequest(BASE_API_STUDENTS);

    const showStudents = () => {
        showModal();
        fetchData();
    }

    const fetchData = () => {
        courseService.getCourseStudents({
            course_id: course?.id,
            onSuccess: (listData) => {
                setData(listData);
            }
        })
    }

    const updateStudents = (selectedOptions, callback) => {
        const listStudentsId = selectedOptions.map(option => option.value)
        const data = {students: listStudentsId}
        courseService.addCourseStudents({
            course_id: course?.id,
            data: data,
            onSuccess: (listData) => {
                setData(listData);
                showDataUpdatedNotification();
                callback();
            }
        })
    }

    const removeStudent = (student_id) => {
        const data = {students: [student_id]}
        courseService.removeCourseStudents({
            course_id: course?.id,
            data: data,
            onSuccess: (listData) => {
                setData(listData);
                showDataDeletedNotification();
            }
        })
    }

    const removeMultipleStudents = (selectedRowKeys) => {
        const data = {students: selectedRowKeys}
        courseService.removeCourseStudents({
            course_id: course?.id,
            data: data,
            onSuccess: (listData) => {
                setData(listData);
                showDataDeletedNotification();
            }
        })
    }

    const columns = [
        {
            title: "NIM",
            width: 60,
            dataIndex: ["user", "username"]
        },
        {
            title: "Nama",
            width: 220,
            dataIndex: ["user", "name"]
        },
        {
            title: "Action",
            width: 60,
            render: (_, record) => <ColumnActionDelete data={record} onConfirm={removeStudent} />
        }
    ]

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    const fetchListStudents = async (keyword) => {
        const res = await studentRequest.getListData(keyword);
        const listData = res.data;
        return listData.map(data => ({
            label: `${data.user.username} - ${data.user.name}`,
            value: data.id
        }))
    }

    return (
        <>
            <Button onClick={showStudents} type="secondary">Daftar Mahasiswa</Button>
            {visible && (
                <DataTableModal
                    columns={columns}
                    data={data}
                    visible={visible}
                    title={`Daftar Mahasiswa - ${course?.name}`}
                    fetchOptions={fetchListStudents}
                    onRemoveSelected={removeMultipleStudents}
                    onSubmit={updateStudents}
                    onCancel={closeModal}
                />
            )}
        </>
    )
}