import { io } from 'socket.io-client';

let socket;

export const connectSocket = (onRequestNearby) => {
    const token = localStorage.getItem('token');

    // Disconnect existing socket if any
    if (socket) {
        socket.disconnect();
    }

    socket = io('/', {
        path: '/socket.io',
        auth: {
            token: token
        }
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('request:nearby', (data) => {
        console.log('New nearby request:', data);
        if (onRequestNearby) {
            onRequestNearby(data);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
