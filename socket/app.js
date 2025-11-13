import { Server } from "socket.io";

// Use proper CORS configuration for production
export const io = new Server({
  cors: {
    origin: [
      "https://burundi-location-maison1.onrender.com",
      "https://burundi-location-3.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
    console.log("User added:", { userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

export const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    // Emit to all clients that user is online
    io.emit("getOnlineUsers", onlineUser);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getOnlineUsers", onlineUser);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;
io.listen(PORT, {
  pingTimeout: 60000,
  pingInterval: 25000
});
console.log(`Socket.IO server running on port ${PORT}`);