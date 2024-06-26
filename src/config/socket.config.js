import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL;
const socket = io(URL, {
    autoConnect: false,
});

socket.on('connect_error', (error) => {
    console.log('Error establishing socket connection: ', error, error.message);
    setTimeout(() => {
    socket.connect();
  }, 1000);
})

export default socket;
