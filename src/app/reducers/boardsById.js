import { ADMIN_ROLE , BOARD_BG_URLS} from '../../constants';

const boardsById = (state = {}, action) => {
  switch (action.type) {
    case "ADD_LIST": {
      const { boardId, listId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: [...state[boardId].lists, listId]
        }
      };
    }
    case "ADD_USER": {
      const {boardId, userToAdd} = action.payload;
      const users = state[boardId].users.filter(user => user.id === userToAdd.id);
      let newUsers;
      if(users.length === 0){
        newUsers = [...state[boardId].users, userToAdd];
      }else{
        newUsers = [...state[boardId].users];
      }
      return {
        ...state,
        [boardId] : {
          ...state[boardId],
          users: newUsers
        }
      }
    }
    case "CHANGE_USER_ROLE" : {
      const {boardId, userId, role} = action.payload;
      
      // Finds the user (by userId) and change only it's role
      const newUsers = state[boardId].users.map(user => user.id === userId ? {...user, role} : user);
      
      return {
        ...state,
        [boardId] : {
          ...state[boardId],
          users: newUsers
        }
      }
    }
    case "REMOVE_USER": {
      const {boardId, userIdToRemove} = action.payload;
      const newUsers = state[boardId].users.filter(user => user.id !== userIdToRemove);

      return {
        ...state,
        [boardId] : {
          ...state[boardId],
          users: newUsers
        }
      }
    }
    case "MOVE_LIST": {
      let  { oldListIndex, newListIndex, boardId } = action.payload;
      oldListIndex = state[boardId].lists.length - 1 - oldListIndex;
      newListIndex = state[boardId].lists.length - 1 - newListIndex;
      const newLists = Array.from(state[boardId].lists);
      const [removedList] = newLists.splice(oldListIndex, 1);
      newLists.splice(newListIndex, 0, removedList);
      return {
        ...state,
        [boardId]: { ...state[boardId], lists: newLists }
      };
    }
    case "DELETE_LIST": {
      const { listId: newListId, boardId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: state[boardId].lists.filter(listId => listId !== newListId)
        }
      };
    }
    case "ADD_LABEL_TO_BOARD":{
      const {boardId,labelToAdd} = action.payload;
      if(state[boardId].hasOwnProperty('labels')){
        console.log("asd");
        return {
          ...state,
          [boardId]: {
            ...state[boardId],
            labels: [...state[boardId].labels, labelToAdd]
          }
        };
      }
      else{
        return {
          ...state,
          [boardId]: {
            ...state[boardId],
            labels: [labelToAdd]
          }
        };
      }
      
    }
    case "ADD_BOARD": {
      const { boardTitle, boardId, userId } = action.payload;
      const image = BOARD_BG_URLS[Math.floor(Math.random()*BOARD_BG_URLS.length)];
      return {
        ...state,
        [boardId]: {
          _id: boardId,
          title: boardTitle,
          lists: [],
          users: [{id: userId, role: ADMIN_ROLE}],
          color: "blue",
          backgroundImage: image
        }
      };
    }
    case "CHANGE_BOARD_TITLE": {
      const { boardTitle, boardId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          title: boardTitle
        }
      };
    }
    case "CHANGE_BOARD_COLOR": {
      const { boardId, color } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          color
        }
      };
    }
    case "CHANGE_BOARD_IMAGE": {
      const { boardId, backgroundImage } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          backgroundImage
        }
      }
    }
    case "DELETE_BOARD": {
      const { boardId } = action.payload;
      const { [boardId]: deletedBoard, ...restOfBoards } = state;
      return restOfBoards;
    }
    default:
      return state;
  }
};

export default boardsById;
