const socket = io();

const $sendBtn = document.getElementById('sendbtn');
const $messageInput = document.getElementById('message');
const $messages = document.getElementById('messages')
const $messageForm = document.getElementById('message-form')

//templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-message-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', ({ username, text, createdAt }) => {
    const html = Mustache.render(messageTemplate, {
        username,
        message: text,
        createdAt: moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', ({ url, createdAt }) => {
    console.log({ url, createdAt })
    const html = Mustache.render(locationTemplate, {
        username,
        url,
        createdAt: moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

$messageForm.onclick = (e) => {
    e.preventDefault();
    if (message && $messageInput.value) {
        const newMessage = $messageInput.value
        $sendBtn.setAttribute('disabled', 'true')
        $sendBtn.innerText = 'Sending...'
        $messageInput.setAttribute('disabled', 'true')
        //emitting new message 
        socket.emit('sendMessage', newMessage, (error) => {
            $sendBtn.removeAttribute('disabled')
            $sendBtn.innerText = 'Send'
            $messageInput.removeAttribute('disabled')
            if (error) {
                return console.log(error)
            }
            // console.log('Message delivered')
            $messageInput.value = ''
        });

    }
}

const sendBtnLocation = document.getElementById('send-location');

sendBtnLocation.onclick = () => {
    if (!navigator.geolocation) {
        return alert('Geo location is not support by your browser')
    }

    sendBtnLocation.setAttribute('disabled', 'true');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, message => {
            sendBtnLocation.removeAttribute('disabled')
            console.log(message)
        })
    })
}

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
})