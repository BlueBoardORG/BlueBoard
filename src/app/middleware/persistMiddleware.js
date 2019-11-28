import { denormalize, schema } from "normalizr";

// Persist the board to the database after almost every action.
const persistMiddleware = store => next => action => {
  next(action);
  const {
    user,
    boardsById,
    listsById,
    cardsById,
    commentsById,
    currentBoardId: boardId
  } = store.getState();

  // Nothing is persisted for guest users
  if (user && !action.dontPersist) {
    if (window._paq) {
      if (action.type === "ADD_BOARD") {
        window._paq.push([
          "trackEvent",
          "ADD_BOARD",
          action.payload.boardTitle
        ]);
      }
      if (action.type === "ADD_LIST") {
        window._paq.push(["trackEvent", "ADD_LIST", action.payload.listTitle]);
      }
      if (action.type === "ADD_CARD") {
        window._paq.push(["trackEvent", "ADD_CARD", action.payload.cardId]);
      }
    }

    if (action.type === "DELETE_BOARD") {
      fetch("/api/board", {
        method: "DELETE",
        body: JSON.stringify({ boardId }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      // All action-types that are not DELETE_BOARD or PUT_BOARD_ID_IN_REDUX are currently modifying a board in a way that should
      // be persisted to db. If other types of actions are added, this logic will get unwieldy.
    } else if (
      ![
        "PUT_BOARD_ID_IN_REDUX",
        "SET_CURRENT_CARD",
        "UPDATE_FILTER",
        "CHANGE_CARD_FILTER",
        "LOAD_BOARD_USERS_DATA",
        "TOGGLE_SOCKET_CONNECTION"
      ].includes(action.type)
    ) {
      // Transform the flattened board state structure into the tree-shaped structure that the db uses.
      const comment = new schema.Entity(
        "commentsById",
        {},
        { idAttribute: "_id" }
      );
      const card = new schema.Entity(
        "cardsById",
        { comments: [comment] },
        { idAttribute: "_id" }
      );
      const list = new schema.Entity(
        "listsById",
        { cards: [card] },
        { idAttribute: "_id" }
      );
      const board = new schema.Entity(
        "boardsById",
        { lists: [list] },
        { idAttribute: "_id" }
      );
      const entities = { commentsById, cardsById, listsById, boardsById };

      const boardData = denormalize(boardId, board, entities);

      // TODO: Provide warning message to user when put request doesn't work for whatever reason
      fetch("/api/board", {
        method: "PUT",
        body: JSON.stringify({ boardData }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
    }
  }
};

export default persistMiddleware;
