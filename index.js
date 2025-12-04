const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: {
    origin: "*",
  },
});

const emailtoSocketMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  
  socket.on("room:join", (data) => {
    const { email, roomId } = data;

    emailtoSocketMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user:join", { email, roomId });
    socket.join(roomId);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, answer }) => {
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });


});
