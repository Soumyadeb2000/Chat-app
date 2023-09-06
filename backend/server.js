const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://127.0.0.1:5500']
    }
});

io.on('connection', socket => {
    socket.on('send-message', (message) => {
        io.emit('receive-message', message);
        console.log(message);
    })
    
})
