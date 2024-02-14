const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log(`User Joined Room: ${data}`);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log(`Message: ${data.message}`);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
  socket.on("error", (error) => {
    console.log(error);
  });
  socket.on("connect_error", (error) => {
    console.log(error);
  });
  socket.on("connect_timeout", (timeout) => {
    console.log(timeout);
  });
  socket.on("reconnect", (attemptNumber) => {
    console.log(attemptNumber);
  });
  socket.on("reconnect_attempt", (attemptNumber) => {
    console.log(attemptNumber);
  });
  socket.on("reconnecting", (attemptNumber) => {
    console.log(attemptNumber);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
