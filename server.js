const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static("webpage"))

io.on('connection', function(socket) {
    console.log('User '+socket.id+' connected');
    socket.on('details', function(details) {
        details.user = socket.id;
        console.log(details);
    });
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('User '+socket.id+' disconnected');
    });
});


http.listen(3000, function() {
   console.log('listening on *:3000');
});            
   