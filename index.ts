import {manageConversation} from "./src/services/chatService";

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

io.on("connection", (socket: any) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("chat", (data: any) => {
    console.log(`User Joined Room: ${data}`);
    socket.join(data);
  });

  socket.on("send_message", async (data: any) => {
    console.log(`Message: ${data.message}`);

    let chatCompletion;
    console.log(chatCompletion);
    if (!data.attachments) {
      chatCompletion = await manageConversation(data.room, data.message);
    }
    else {
      chatCompletion=  await manageConversation(data.room, data.message, data.attachments);
    }
    socket.to(data.room).emit("receive_message", chatCompletion);
    socket.in(data.room).emit("receive_message", chatCompletion);
    socket.emit("receive_message", chatCompletion);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
  socket.on("error", (error: any) => {
    console.log(error);
  });
  socket.on("connect_error", (error: any) => {
    console.log(error);
  });
  socket.on("connect_timeout", (timeout: any) => {
    console.log(timeout);
  });
  socket.on("reconnect", (attemptNumber: any) => {
    console.log(attemptNumber);
  });
  socket.on("reconnect_attempt", (attemptNumber: any) => {
    console.log(attemptNumber);
  });
  socket.on("reconnecting", (attemptNumber: any) => {
    console.log(attemptNumber);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
