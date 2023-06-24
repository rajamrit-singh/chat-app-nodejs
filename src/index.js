const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
var Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
/* Socket io expects to be called with raw http server. Therefore created createServer
   Express creates that behind the scenes and therefore we wont have access to it unless
   explicitly mentioned as done above.
*/
const io = socketio(server)     

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('new web socket')
    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast.emit('message', generateMessage('A new user has joined'));   //this will broadcast the message to everyone except the current user
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }
        io.emit('message', generateMessage(message));
        callback('delivered' );
    })

    socket.on('disconnect', () => {     //disconnect is a built-in event when user disconnected
        io.emit('message', generateMessage('A user has left' ));
    })

    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`));
        callback();
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})
