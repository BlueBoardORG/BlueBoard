const userChangeMiddleware = store => next => action => {
  next(action);
  const { user, currentBoardId: boardId, boardsById } = store.getState();

  if (user && !action.dontPersist) {
    if (action.type === "REMOVE_USER") {
      let { userIdToRemove: userId } = action.payload;
      const { title } = boardsById[boardId];
      const newAdminId = boardsById[boardId].newAdminIfExist;
      if (newAdminId)
        postWithParams(newAdminId, boardId, "CHANGE_USER_ROLE", title);
      postWithParams(userId, boardId, action.type, title);
    }
  }
};

function postWithParams(userId, boardId, action, title) {
  fetch("/api/notifications", {
    method: "POST",
    body: JSON.stringify({ userId, boardId, action, title }),
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });
}




export default userChangeMiddleware;
