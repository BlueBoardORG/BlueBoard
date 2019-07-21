import socket from "../socketIOHandler";

const watchMiddleware = store => next => action => {
  next(action);
  const { currentBoardId: boardId, boardsById } = store.getState();


  /*if(store.getState().boardsById[boardId]){
        currentWatchMode = store.getState().boardsById[boardId].users.find(boardUser=>boardUser.id === user._id).watch;
    }*/

  const notWatchingFunctions = [
    "UPDATE_ASSIGNED_USER",
    "ADD_USER",
    "REMOVE_USER",
    "CHANGE_USER_ROLE"
  ];

  if (!action.dontPersist) {
    if (boardsById[boardId]) {
      boardsById[boardId].users.forEach(user => {
        const currentWatchMode = user.watch;
        if ((currentWatchMode === "Not watching" && notWatchingFunctions.includes(action.type)) || currentWatchMode === "Watching") {
          switch (action.type) {
            case "UPDATE_ASSIGNED_USER": {
              const { assignedUserId } = action.payload;
              const { title } = boardsById[boardId];
              if(user.id === assignedUserId){
                postWithParams(assignedUserId, boardId, action.type, title);
              }
              break;
            }
            case "ADD_USER": {
              let { userToAdd } = action.payload;
              const { title } = boardsById[boardId];
              if(user.id === userToAdd){
                postWithParams(userToAdd.id, boardId, action.type, title);
              }
              break;
            }
            case "REMOVE_USER": {
              let { userIdToRemove: userId } = action.payload;
              const { title } = boardsById[boardId];
              if(user.id === userId){
                postWithParams(userId, boardId, action.type, title);
              }
              break;
            }
            case "CHANGE_USER_ROLE": {
              let { userId } = action.payload;
              const { title } = boardsById[boardId];
              if(user.id === userId){
                postWithParams(userId, boardId, action.type, title);
              }
              break;
            }
            default: {
              break;
            }
          }
        }
      });
    }
  }
};

export default watchMiddleware;
