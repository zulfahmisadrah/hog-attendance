import Dexie from 'dexie';

export const db = new Dexie('neo_attendance');

db.version(1).stores({
    profile: '++id, username, name',
    meetings: 'id, name, number, date, status, day_of_week, start_time, end_time, course_name'
});


