import {
    ADMIN_ROLE,
    READ_WRITE_ROLE,
    READ_ROLE
} from "../../../constants";


export const adminLeaveHandler = (userId, users) => {
    let newUsers = users;
    if (!doesMoreAdmin(userId, users)) {
        const firstReadWrite = findFirstUserInRole(READ_WRITE_ROLE, users)
        if (!firstReadWrite) {
            const firstRead = findFirstUserInRole(READ_ROLE, users);
            if (!firstRead)
                return newUsers;
            else
                newUsers = changeUserRoleToAdmin(firstRead, users);
        }
        else
            newUsers = changeUserRoleToAdmin(firstReadWrite, users);
    }
    else{
        console.log('MORE ADMIN');
    }
    return newUsers;
}

const findFirstUserInRole = (role, users) => {
    for (var i = 0; i < users.length; i++) {
        if (users[i].role === role) {
            console.log('findFirstUserInRole', i);
            return i;
        }
    }
    return null;
}

const doesMoreAdmin = (userId, users) => {
    for(var i=0; i<users.length; i++) {
        if(users[i].id !== userId && users[i].role === ADMIN_ROLE)
           return true; 
    }
    return false;
}


const changeUserRoleToAdmin = (userIndex, users) => {
    users[userIndex].role = ADMIN_ROLE;
    return users;
}

export const isCurrentUserAdmin = (userIdToRemove, users) => {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userIdToRemove)
            return users[i].role === ADMIN_ROLE;
    }
}
