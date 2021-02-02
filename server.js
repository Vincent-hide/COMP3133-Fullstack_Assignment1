const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const appName = "Chat Assignment";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinChat", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", { msg: "Hi", user: "Server" });

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit("message", {
        msg: `${user.username} has joined &#127881;`,
        user: "Server",
      });

    // Send a list of users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Receive messages from a client
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", { msg: msg, user: user.username, rand: user.userIcon});
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected");

    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        msg: `${user.username} has left this chat room &#x1F625;`,
        user: "Server",
      });

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
