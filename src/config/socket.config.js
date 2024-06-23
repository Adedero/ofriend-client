import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API.slice(0, -1);
const socket = io(URL, {
    autoConnect: false, // we will manually connect in Vue components
});

export default socket;
