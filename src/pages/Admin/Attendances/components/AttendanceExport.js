import React, {useEffect, useState} from 'react';
import {Button, Col, Collapse, Form, Row, Select} from "antd";
import {CourseService, MeetingService} from "../../../../services/services";
import {getCurrentDateTime} from "../../../../utils/Commons";
import {attendanceStatus, dateTimeIdFormat} from "../../../../utils/Constants";
import * as Excel from "exceljs";
import * as FileSaver from "file-saver";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export function AttendanceExport() {

    const [coursesOptions, setCoursesOptions] = useState([]);
    const [form] = Form.useForm();

    const courseService = new CourseService();
    const meetingService = new MeetingService();

    useEffect(() => {
        courseService.getListCoursesOptions((listCoursesOptions) => setCoursesOptions(listCoursesOptions))
    }, []);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            meetingService.getCourseMeetings({
                course_id: values.course_id,
                onSuccess: (meetings) => {
                    handleExport(meetings);
                }
            })
        }).catch(e => {
            console.log("Validate error", e);
        })
    }

    const handleExport = async (meetings) => {
        const meetingNumberColumns = meetings.map((_, index) => (index + 1).toString());
        const studentsNIM = meetings[0].attendances.map(attendance => attendance.student.user.username);
        const studentsName = meetings[0].attendances.map(attendance => attendance.student.user.name);
        const meetingsAttendances = meetings.map(meeting => meeting.attendances);

        const columns = ["No", "NIM", "Nama", ...meetingNumberColumns, "Persentase"];

        const data = studentsName.map((student, index) => {
            const row = {
                [columns[0]]: index + 1,
                [columns[1]]: studentsNIM[index],
                [columns[2]]: studentsName[index],
            };
            const meetingStartIndex = 3;
            meetingNumberColumns.forEach((number, i) => {
                row[columns[meetingStartIndex + i]] = meetingsAttendances[i][index]?.status || attendanceStatus.absent;
            })

            const totalAttend = meetingsAttendances.filter(meeting => meeting[index]?.status === attendanceStatus.attend).length;
            const attendPercentage = meetingNumberColumns.length > 0 ? (totalAttend * 100 / meetingNumberColumns.length).toFixed(0) : 0;
            row[columns[columns.length - 1]] = attendPercentage.toString() + "%";
            return row;
        })

        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet();

        sheet.columns = [
            {header: "No", key: "No", width: 5},
            {header: "NIM", key: "NIM", width: 15},
            {header: "Nama", key: "Nama", width: 30},
            ...meetingNumberColumns.map(number => ({header: number, key: number, width: 8})),
            {header: "Persentase", key: "Persentase", width: 12},
        ];

        sheet.duplicateRow(1, 8, true);

        const centerAlignment = { vertical: "middle", horizontal: "center" }
        const leftAlignment = { vertical: "middle", horizontal: "left" }
        const fontBold = { bold: true }
        const fontNormal = { bold: false }
        const thinBorder = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        sheet.getRow(1).values = ["REKAPITULASI PRESENSI MAHASISWA"];
        sheet.getRow(1).alignment = centerAlignment;
        sheet.getRow(1).font = fontBold;
        sheet.mergeCells('A1', String.fromCharCode('A'.charCodeAt(0) + (meetingNumberColumns.length + 3)));

        sheet.getRow(2).values = [];

        sheet.getRow(3).values = ["Nama Mata Kuliah", "", ": " + meetings[0]?.course?.name];
        sheet.getRow(3).alignment = leftAlignment;
        sheet.getRow(3).font = fontNormal;
        sheet.mergeCells('A3', 'B3');

        sheet.getRow(4).values = ["Kode Mata Kuliah", "", ": " + meetings[0]?.course?.code];
        sheet.getRow(4).font = fontNormal;
        sheet.mergeCells('A4', 'B4');

        sheet.getRow(5).values = ["Tahun Ajaran", "", ": " + meetings[0]?.semester?.academic_year];
        sheet.getRow(5).font = fontNormal;
        sheet.mergeCells('A5', 'B5');

        sheet.getRow(6).values = ["Semester", "", ": " + meetings[0]?.semester?.type];
        sheet.getRow(6).font = fontNormal;
        sheet.mergeCells('A6', 'B6');

        sheet.getRow(7).values = [];
        sheet.getRow(8).values = [];
        sheet.getRow(8).font = fontBold;
        sheet.getRow(9).font = fontBold;
        sheet.getRow(9).alignment = centerAlignment;

        const rowStart = 8;

        const colNo = 1;
        sheet.mergeCells(rowStart, colNo, (rowStart + 1), colNo);
        sheet.getCell(rowStart, colNo).value = 'No';

        const colNIM = 2;
        sheet.mergeCells(rowStart, colNIM, (rowStart + 1), colNIM);
        sheet.getCell(rowStart, colNIM).value = 'NIM';

        const colNama = 3;
        sheet.mergeCells(rowStart, colNama, (rowStart + 1), colNama);
        sheet.getCell(rowStart, colNama).value = 'Nama';

        const colPertemuan = 4;
        const mergedCellEnd = colPertemuan + meetingNumberColumns.length - 1;
        sheet.mergeCells(rowStart, colPertemuan, rowStart, mergedCellEnd);
        sheet.getCell(rowStart, colPertemuan).value = 'Pertemuan';
        sheet.getCell(rowStart, colPertemuan).alignment = centerAlignment;

        const colPercentage = colPertemuan + meetingNumberColumns.length;
        sheet.mergeCells(rowStart, colPercentage, (rowStart + 1), colPercentage);
        sheet.getCell(rowStart, colPercentage).value = 'Persentase';

        sheet.addRows(data);

        const start = {row: rowStart, col: 1}
        const end = {row: rowStart + studentsName.length + 1, col: colPercentage}
        for (let r = start.row; r <= end.row; r++) {
            for (let c = start.col; c <= end.col; c++) {
                sheet.getCell(r, c).border = thinBorder;
            }
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: fileType});
        const filename = getCurrentDateTime(dateTimeIdFormat)
        FileSaver.saveAs(blob, filename + fileExtension);
    }

    return (
        <Collapse defaultActiveKey="1">
            <Collapse.Panel header="Export Laporan Rekapitulasi" key="1">
                <Form
                    layout='vertical'
                    form={form}
                >
                    <Row gutter={[8, 8]}>
                        <Col xs={24} md={24}>
                            <Form.Item label="Mata Kuliah" name="course_id" required>
                                <Select
                                    options={coursesOptions}
                                    placeholder="Pilih Mata Kuliah"
                                    showSearch
                                    filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24}>
                            <Row justify="end">
                                <Button htmlType="submit" type="primary" onClick={handleSubmit}>Export</Button>
                                {/*<ExportToExcel data={[]} ref={exportRef} />*/}
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Collapse.Panel>
        </Collapse>
    )
}