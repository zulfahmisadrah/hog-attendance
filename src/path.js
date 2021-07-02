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
    meetings: `${adminRootPath}meetings`,
    attendances: `${adminRootPath}attendances`,
    teachers: `${adminRootPath}teachers`,
    users: `${adminRootPath}users`,
}

export const pathName = {
    [adminRootPath]: 'Dashboard',
    [adminPath.dashboard]: 'Dashboard',
    [adminPath.meetings]: 'Pertemuan',
    [adminPath.attendances]: 'Kehadiran',
    [adminPath.teachers]: 'Pengajar',
    [adminPath.users]: 'User'
}

export const pathGroupFirstMenu = [adminPath.meetings, adminPath.teachers];
export const pathSuperAdmin = [adminPath.users];

export const pathGroupName = {
    [pathGroupFirstMenu[0]]: 'DATA',
    [pathGroupFirstMenu[1]]: 'MANAGE'
}