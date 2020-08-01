exports.generateMessage = (id, username, text) => ({
    id,
    username,
    text,
    createdAt: new Date().getTime()
})

exports.generateLocationMessage = (id, username, url) => ({
    id,
    username,
    url,
    createdAt: new Date().getTime()
})