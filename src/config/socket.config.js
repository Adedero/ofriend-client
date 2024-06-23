import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API;
const socket = io(URL, {
    autoConnect: false, // we will manually connect in Vue components
});

export default socket;
