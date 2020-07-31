exports.generateMessage = (username, text) => ({
    username,
    text,
    createdAt: new Date().getTime()
})

exports.generateLocationMessage = (username, url) => ({
    username,
    url,
    createdAt: new Date().getTime()
})