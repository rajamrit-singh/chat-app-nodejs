const socket = io();   //initiate new web socket client connection

socket.on('message' , (message) => {
    console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const inputMessage = event.target.elements.message.value;   //We can acced the name (message) on elements
    socket.emit('sendMessage', inputMessage);
})