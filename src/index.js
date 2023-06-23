const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

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

// let count = 0

io.on('connection', (socket) => {
    console.log('new web socket')
    socket.emit('message', 'Welcome');
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
        console.log(message)
    })
//     socket.on('increment', () => {
//         count += 1
//         socket.emit('countUpdated', count)
//         io.emit('countUpdated', count);
//     })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})
