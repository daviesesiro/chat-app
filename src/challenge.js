const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

let messages = []
io.on('connection', (socket) => {
    console.log('Socket connected');
    socket.emit('welcome', "Welcome");
})

server.listen(process.env.PORT || 5001, () => console.log('app started'))