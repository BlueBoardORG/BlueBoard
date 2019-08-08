import {
    ADMIN_ROLE,
    READ_WRITE_ROLE,
    READ_ROLE
} from "../../../constants";


export const chooseAnotherAdmin = (users) => {
    let newUsers = users;
    if (checkRoleSum(ADMIN_ROLE, users) === 1) {
        if (checkRoleSum(READ_WRITE_ROLE, users) === 0) {
            if (checkRoleSum(READ_ROLE, users) === 0) {
                console.log('LAST USER');
                return newUsers;
            }
            else {
                console.log('READ');
                newUsers = mkFirstToAdmin(READ_ROLE, users)
            }
        }
        else {
            console.log('READ-WRITE');
            newUsers = mkFirstToAdmin(READ_WRITE_ROLE, users);
        }
    }
    else {
        console.log('MORE ADMINS');
    }
    return newUsers;
}

const checkRoleSum = (role, users) => {
    let count = 0;
    console.log(users);
    for (var i = 0; i < users.length; i++) {
        console.log(users[i].role, role);
        if (users[i].role === role) {
            count++;
        }
    }
    return count;
}

const mkFirstToAdmin = (role, users) => {
    const newUsersArray = users.map(user => user);
    console.log(newUsersArray);
    for (var i = 0; i < newUsersArray.length; i++) {
        if (newUsersArray[i].role === role) {
            newUsersArray[i].role = ADMIN_ROLE;
            console.log('mkFirstToAdmin', newUsersArray[i].id, newUsersArray)
            return newUsersArray;
        }
    }
}

export const isCurrentUserAdmin = (userIdToRemove, users) => {
    for(var i=0; i<users.length; i++) {
        if(users[i].id === userIdToRemove)
           return  users[i].role === ADMIN_ROLE;
    }
}
