import { io } from 'socket.io-client';

const URL = import.meta.env.SERVER_URL;
const socket = io(URL, {
    autoConnect: false, // we will manually connect in Vue components
});

export default socket;
