import React, {useState} from "react";
import {Button} from "antd";
import {CourseService} from "../../../../services/services";
import {DataTableModal} from "./DataTableModal";
import {ColumnActionDelete} from "../../../../components/ColumnActionDelete";
import PropTypes from "prop-types";
import LecturerRequest from "../../../../services/endpoints/lecturers";
import {BASE_API_LECTURERS} from "../../../../services/endpoints/_constants";
import {showDataDeletedNotification, showDataUpdatedNotification} from "../../../../utils/Commons";

ButtonShowLecturers.propTypes = {
    course: PropTypes.object.isRequired
}

export function ButtonShowLecturers(props) {
    const {course} = props

    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);

    const courseService = new CourseService();
    const lecturerRequest = new LecturerRequest(BASE_API_LECTURERS);

    const showLecturers = () => {
        showModal()
        fetchData()
    }

    const fetchData = () => {
        courseService.getCourseLecturers({
            course_id: course?.id,
            onSuccess: (listData) => {
                setData(listData);
            }
        })
    }

    const updateLecturers = (selectedOptions) => {
        const listLecturersId = selectedOptions.map(option => option.value)
        const data = {lecturers: listLecturersId}
        courseService.addCourseLecturers({
            course_id: course?.id,
            data: data,
            onSuccess: (listData) => {
                setData(listData);
                showDataUpdatedNotification();
            }
        })
    }

    const removeLecturer = (lecturer_id) => {
        const data = {lecturers: [lecturer_id]}
        courseService.removeCourseLecturers({
            course_id: course?.id,
            data: data,
            onSuccess: (listData) => {
                setData(listData);
                showDataDeletedNotification();
            }
        })
    }

    const removeMultipleLecturers = (selectedRowKeys) => {
        const data = {lecturers: selectedRowKeys}
        courseService.removeCourseLecturers({
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
            title: "NIDN",
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
            render: (_, record) => <ColumnActionDelete data={record} onConfirm={removeLecturer} />
        }
    ]

    const showModal = () => setVisible(true)
    const closeModal = () => setVisible(false)

    const fetchListLecturers = async (keyword) => {
        const res = await lecturerRequest.getListData(keyword);
        const listData = res.data;
        return listData.map(data => ({
            label: `${data.user.username} - ${data.user.name}`,
            value: data.id
        }))
    }

    return (
        <>
            <Button onClick={showLecturers} type="secondary">Daftar Dosen</Button>
            {visible && (
                <DataTableModal
                    columns={columns}
                    data={data}
                    visible={visible}
                    title={`Daftar Dosen - ${course?.name}`}
                    fetchOptions={fetchListLecturers}
                    onRemoveSelected={removeMultipleLecturers}
                    onSubmit={updateLecturers}
                    onCancel={closeModal}
                />
            )}
        </>
    )
}