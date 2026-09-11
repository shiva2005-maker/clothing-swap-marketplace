const express = require('express');
const app = express();
const cookieparser = require("cookie-parser");
const  cors = require("cors");
const mongodb = require('./Config/MongooseConfig');
const UserRouter = require("./Routes/UserRouter");
const ClothingRouter = require("./Routes/clothingRouter");
const SwapRequestRouter = require("./Routes/swapRequestRouter");
const messageRouter = require("./Routes/messageRouter");
const AdminRouter = require("./Routes/AdminRouter");


const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://clothing-swap-marketplace-om9o.vercel.app",
    credentials: true,
  },
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieparser());

const corsOptions = {
  origin: "https://clothing-swap-marketplace-om9o.vercel.app",
  credentials: true,                // required for cookies/credentials
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};
app.use(cors(corsOptions));


app.use("/user",UserRouter);

app.use('/clothing',ClothingRouter);

app.use('/swap',SwapRequestRouter);

app.use('/message',messageRouter);

app.use('/admin',AdminRouter);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);

    console.log(
      `Socket ${socket.id} joined room ${roomId}`
    );
  });

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);

    io.to(data.roomId).emit(
      "receiveMessage",
      data
    );
  });

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

server.listen(process.env.port || 5000, () => {
  console.log(`Server running on port ${process.env.port || 5000}`);
});