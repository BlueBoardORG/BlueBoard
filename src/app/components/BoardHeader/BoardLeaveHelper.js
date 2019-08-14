import {
    ADMIN_ROLE,
    READ_WRITE_ROLE,
    READ_ROLE
} from "../../../constants";


export const adminLeaveHandler = (userId, users) => {
    let newAdminIfExist=null;
    if (!doesAnotherAdminExist(userId, users)) {
        const firstReadWrite = findFirstUserInRole(READ_WRITE_ROLE, users)
        if (!firstReadWrite) {
            const firstRead = findFirstUserInRole(READ_ROLE, users);
            if (!firstRead)
                return users;
            else {
                users[firstRead].role = ADMIN_ROLE;
                newAdminIfExist = users[firstRead].id;
            }
        }
        else{
            users[firstReadWrite].role = ADMIN_ROLE;
            newAdminIfExist = users[firstReadWrite].id;
        }
    }
    return  {
        users: users,
        newAdminIfExist: newAdminIfExist
    }
}

const findFirstUserInRole = (role, users) => {
    for (var i = 0; i < users.length; i++) {
        if (users[i].role === role) {
            return i;
        }
    }
    return;
}

const doesAnotherAdminExist = (userId, users) => {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id !== userId && users[i].role === ADMIN_ROLE)
            return true;
    }
    return false;
}

export const isCurrentUserAdmin = (userId, users) => {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId)
            return users[i].role === ADMIN_ROLE;
    }
}
