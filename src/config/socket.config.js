import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL;
const socket = io(URL, {
    autoConnect: false,
    closeOnBeforeunload: true,
});

socket.on('error', (error) => {
    console.log('Error establishing socket connection: ', error)
})

export default socket;
