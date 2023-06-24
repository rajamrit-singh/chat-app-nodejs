const socket = io();   //initiate new web socket client connection

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message' , (message) => {
    console.log(message);
    const html = Mustache.render($messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html)
});

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render($locationTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('hh:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const inputMessage = event.target.elements.message.value;   //We can acced the name (message) on elements
    if (!inputMessage.trim()) {
        $messageFormButton.removeAttribute('disabled');
        return;
    }
    socket.emit('sendMessage', inputMessage, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {    //acknowledgement callback function for send message
            return console.log(error);
        } else {
            console.log('Message delivered');
        }
    });
})

$sendLocationButton.addEventListener('click', (event) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location Shared');     //Acknowledgement for location share
            $sendLocationButton.removeAttribute('disabled');
        })
    })
})

socket.emit('join', { username, room })