import socket from '../socketIOHandler';

const historyMiddleware = store => next => action => {
    next(action);
    const {
        user,
        currentBoardId: boardId
    } = store.getState();

    if (user && !action.dontPersist) {
        if (!['PUT_BOARD_ID_IN_REDUX', 'UPDATE_FILTER', 'CHANGE_CARD_FILTER', 'LOAD_BOARD_USERS_DATA', 'SET_CURRENT_CARD', 'TOGGLE_SOCKET_CONNECTION', 'CHANGE_USER_WATCH'].includes(action.type)) {
            fetch("/api/history", {
                method: "POST",
                body: JSON.stringify({ userId: user._id, boardId, action: action.type, payload: action.payload, socketId: socket.id }),
                headers: { "Content-Type": "application/json" },
                credentials: "include"
            })
        }
    }
};

export default historyMiddleware;