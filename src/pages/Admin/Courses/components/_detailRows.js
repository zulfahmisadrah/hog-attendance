import {DataType} from "../../../../utils/Constants";
import {RowID, RowTimeStamp} from "../../../../components";

export const _detailRows = [
    ...RowID,
    {
        title: "Kode",
        dataIndex: "code",
        type: DataType.TEXT
    },
    {
        title: "Nama",
        dataIndex: "name",
        type: DataType.TEXT
    },
    {
        title: "Departemen",
        dataIndex: ["department", "name"],
        type: DataType.TEXT
    },
    {
        title: "Jenis",
        dataIndex: "type",
        type: DataType.TEXT
    },
    {
        title: "SKS",
        dataIndex: "sks",
        type: DataType.TEXT
    },
    {
        title: "Semester",
        dataIndex: "semester",
        type: DataType.TEXT
    },
    {
        title: "Daya Tampung",
        dataIndex: "quota",
        type: DataType.TEXT
    },
    ...RowTimeStamp
]