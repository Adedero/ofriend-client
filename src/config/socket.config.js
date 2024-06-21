import { io } from 'socket.io-client';

const URL = "http://localhost:4000";
const socket = io(URL, {
    autoConnect: false, // we will manually connect in Vue components
});

export default socket;