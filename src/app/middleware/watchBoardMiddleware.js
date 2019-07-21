import socket from '../socketIOHandler';


const watchMiddleware = store => next => action => {
    next(action);
    const {
        user,
        currentBoardId: boardId,
      } = store.getState();

    let currentWatchMode = null;

    if(store.getState().boardsById[boardId]){
        currentWatchMode = store.getState().boardsById[boardId].users.find(boardUser=>boardUser.id === user._id).watch;
    }

    console.log("action:");
    console.log(action);


    if (user && !action.dontPersist) {
        if (
            [
              "UPDATE_ASSIGNED_USER",
              "ADD_USER",
              "REMOVE_USER",
              "CHANGE_USER_ROLE"
            ].includes(action.type)
          )
    }
};

export default watchMiddleware;