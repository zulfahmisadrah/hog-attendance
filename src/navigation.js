import {adminPath, pathName} from "./path";
import {SidebarIcons} from "./assets/icons";

const getNavigation = () => {
    const listNav = []
    Object.values(adminPath).forEach( item => {
            const name = pathName[item]
            listNav.push({
                title: name,
                href: item,
                icon: SidebarIcons[name]
            })
        }
    )
    return listNav
}

export default getNavigation;