const socketConnected = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_SOCKET_CONNECTION": {
      return action.payload;
    }
    default:
      return state;
  }
};

export default socketConnected;
