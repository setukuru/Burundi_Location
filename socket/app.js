import { Server } from "socket.io";

export const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
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

  // Track new online user
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  // Messaging (optional)
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.error("Receiver not found:", receiverId);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const SOCKET_PORT = process.env.SOCKET_PORT || 5001;
io.listen(SOCKET_PORT);
console.log(`Socket.IO server running on port ${SOCKET_PORT}`);