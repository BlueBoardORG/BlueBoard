import socketIOClient from 'socket.io-client';
import {SOCKETLOCATION} from "../constants";

// const getSocket = () => {
//     if(this.socket)
//         return this.socket;
//     this.socket = socketIOClient(SOCKETLOCATION);
//     return this.socket;
// }  

// export default getSocket();

const socket = socketIOClient(SOCKETLOCATION);

export default socket;