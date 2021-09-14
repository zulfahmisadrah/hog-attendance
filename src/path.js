export const rootPath = '/'
export const adminRootPath = '/admin/'
export const imagePath = `${rootPath}../images/`
export const loginPath = `${rootPath}login`
export const registerPath = `${rootPath}register`

export const teacherBottomNavPath = {
    home: `${rootPath}home`,
    meetings: `${rootPath}meetings`,
    attendances: `${rootPath}attendances`,
    profile: `${rootPath}profile`,
}

export const noAppbarPath = {
    takePresence: `${teacherBottomNavPath.meetings}/:meetingId/takePresence`
}

export const teacherPath = {
    ...teacherBottomNavPath,
    ...noAppbarPath
}

export const teacherPathTitle = {
    [teacherPath.home]: "Home",
    [teacherPath.meetings]: "Pertemuan",
    [teacherPath.attendances]: "Riwayat",
    [teacherPath.profile]: "Profil",
}

export const adminPath = {
    dashboard: `${adminRootPath}dashboard`,
    courses: `${adminRootPath}courses`,
    meetings: `${adminRootPath}meetings`,
    attendances: `${adminRootPath}attendances`,
    datasets: `${adminRootPath}datasets`,
    semesters: `${adminRootPath}semesters`,
    schedules: `${adminRootPath}schedules`,
    students: `${adminRootPath}students`,
    lecturers: `${adminRootPath}lecturers`,
    faculties: `${adminRootPath}faculties`,
    departments: `${adminRootPath}departments`,
    users: `${adminRootPath}users`,
    roles: `${adminRootPath}roles`,
}

export const pathName = {
    [adminRootPath]: 'Dashboard',
    [adminPath.dashboard]: 'Dashboard',
    [adminPath.courses]: 'Mata Kuliah',
    [adminPath.meetings]: 'Pertemuan',
    [adminPath.attendances]: 'Kehadiran',
    [adminPath.datasets]: 'Dataset',
    [adminPath.semesters]: 'Semester',
    [adminPath.schedules]: 'Jadwal',
    [adminPath.students]: 'Mahasiswa',
    [adminPath.lecturers]: 'Dosen',
    [adminPath.faculties]: 'Fakultas',
    [adminPath.departments]: 'Departemen',
    [adminPath.users]: 'User',
    [adminPath.roles]: 'Role'
}

export const pathGroupFirstMenu = [adminPath.courses, adminPath.datasets];
export const pathSuperAdmin = [adminPath.users, adminPath.roles];

export const pathGroupName = {
    [pathGroupFirstMenu[0]]: 'KULIAH',
    [pathGroupFirstMenu[1]]: 'DATA'
}