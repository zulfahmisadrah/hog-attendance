import APIService from "../../utils/APIService";
import APIRequest from "../../utils/APIRequest";
import {BASE_API_SCHEDULES} from "../endpoints/_constants";
import {DayOfWeek, timeFormat, timeTextFormat} from "../../utils/Constants";
import {formatDateTime} from "../../utils/Commons";

export class ScheduleService extends APIService {
    constructor() {
        const apiRequest = new APIRequest(BASE_API_SCHEDULES);
        super(apiRequest);
    }

    getListScheduleOptions = (callback) => {
        this.getListData({
            onSuccess: (listData) => {
                // const sortedListData = listData.sort((a, b) => a.name.localeCompare(b.name))
                const listOptions = listData.map(schedule => ({
                    label: `${DayOfWeek[schedule.day_of_week]}, ${formatDateTime(schedule.start_time, timeTextFormat, timeFormat)} - ${formatDateTime(schedule.end_time, timeTextFormat, timeFormat)}`,
                    value: schedule.id
                }))
                callback(listOptions)
            }
        })
    }
}