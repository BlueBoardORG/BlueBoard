const socketConnected = (state = false, action) => {
    switch (action.type) {
      case "TOGGLE_SOCKET_CONNECTION": {
        console.log(state, action.payload);
        return action.payload;
      }
      default:
        return state;
    }
  };
  
  export default socketConnected;
  