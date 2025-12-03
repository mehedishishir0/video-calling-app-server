const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: {
    origin: "*",
  },
});

const emailtoSocketMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("socket connection ", socket.id);
  socket.on("room:join", (data) => {
    const { email, roomId } = data;

    emailtoSocketMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user:join", { email, roomId });
    socket.join(roomId);
    io.to(socket.id).emit("room:join", data);
  });
});
