export function getUserIdFromAction(action){
    switch (action.type) {
        case "UPDATE_ASSIGNED_USER": {
          const { assignedUserId } = action.payload;
          return assignedUserId;
        }
        case "ADD_USER": {
          const { userToAdd } = action.payload;
          return userToAdd.id;
        }
        case "REMOVE_USER": {
          const { userIdToRemove: userId } = action.payload;
          return userId
        }
        case "CHANGE_USER_ROLE": {
          const { userId } = action.payload;
          return userId;
        }
        
        default: {
          break;
        }
      }
}