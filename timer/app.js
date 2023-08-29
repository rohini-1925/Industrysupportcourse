const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Create a list of timers
const timers = [];

// Endpoint to get all timers
app.get('/gettimers', (req, res) => {
  res.send(timers);
});

// Endpoint to update a timer
app.post('/updatetimer', (req, res) => {
  const timerId = req.body.timerId;
  const currentTime = req.body.currentTime;

  // Update the timer in the list
  timers.forEach((timer) => {
    if (timer.timerId === timerId) {
      timer.currentTime = currentTime;
    }
  });

  // Notify all clients of the update
  io.emit('updatetimer', timers);

  res.sendStatus(200);
});

// Listen for connections
http.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Sockets
io.on('connection', (socket) => {
  // Listen for timer updates
  socket.on('updatetimer', (timers) => {
    // Update the timers in the client
    socket.emit('updatetimer', timers);
  });
});
