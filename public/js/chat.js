const socket = io();

const $sendBtn = document.getElementById('sendbtn');
const $messageInput = document.getElementById('message');
const $messages = document.getElementById('messages')
const $messageForm = document.getElementById('message-form')

//templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;
//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //visitble height
    const visibleHeight = $messages.offsetHeight;

    //height of messages container
    const containerHeight = $messages.scrollHeight;

    //how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight - 40 <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', ({ id, username, text, createdAt }) => {
    const isMe = socket.id === id;
    const html = Mustache.render(messageTemplate, {
        isMe,
        username: isMe ? 'Me' : username,
        message: text,
        createdAt: moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', ({ id, url, createdAt }) => {
    const isMe = socket.id == id;
    const html = Mustache.render(locationTemplate, {
        isMe,
        username: isMe ? 'Me' : username,
        url,
        createdAt: moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.getElementById('sidebar').innerHTML = html
})

$messageForm.onsubmit = (e) => {
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

            $messageInput.value = ''
            $messageInput.focus();
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
        })
    })
}

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
})
