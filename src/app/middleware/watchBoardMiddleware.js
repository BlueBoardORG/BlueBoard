import {getUserIdFromAction} from "./getUserId";

const watchMiddleware = store => next => action => {
  next(action);
  const { currentBoardId: boardId, boardsById } = store.getState();   

  const notWatchingFunctions = [
    "UPDATE_ASSIGNED_USER",
    "ADD_USER",
    "REMOVE_USER",
    "CHANGE_USER_ROLE"
  ];

  const watchingFunctions = [
    "TOGGLE_SOCKET_CONNECTION",
    "MOVE_CARD",
    "ENTER_AS_GUEST",
    "UPDATE_FILTER",
    "CHANGE_CARD_FILTER",
    "SET_CURRENT_CARD",
    "PUT_BOARD_ID_IN_REDUX",
    "ADD_BOARD",
    "LOAD_BOARD_USERS_DATA",
    "CHANGE_USER_WATCH"
  ];

  function postWithParams(userId, boardId, action, title) {
    fetch("/api/notifications", {
      method: "POST",
      body: JSON.stringify({ userId, boardId, action, title }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
  }

  function debugConsole(userId, currentWatchMode){
    console.log("userId: ");
    console.log(userId);
    console.log("userWatch:");
    console.log(currentWatchMode);
  }

  if (!action.dontPersist) {
    console.log("action");
    console.log(action);

    if (boardsById[boardId]) {
      boardsById[boardId].users.forEach(user => {
        console.log("user:");
        console.log(user);

        const currentWatchMode = user.watch;
        const { title } = boardsById[boardId];

        if(currentWatchMode === "Watching" && !watchingFunctions.includes(action.type)){
          console.log("got into watching");
          postWithParams(user.id, boardId, action.type, title);
        }
        
        else if (currentWatchMode === "Not watching" && notWatchingFunctions.includes(action.type)) {
          if(user.id === getUserIdFromAction(action)){
            postWithParams(user.id, boardId, action.type, title);
          }
        }
      });
    }
  }
};


export default watchMiddleware;