const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./backend/routes/userRoutes");
const pageRoutes = require("./backend/routes/pageRoutes");
const cardRoutes = require("./backend/routes/cardRoutes");
const boardRoutes = require("./backend/routes/boardRoutes");
const connectDB = require("./backend/config/db");

dotenv.config();

connectDB();
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/page", pageRoutes);
app.use("/api/card", cardRoutes);
app.use("/api/board", boardRoutes);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server created successfully ${PORT}`)
);

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });
//
//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("user joined room: " + room);
//   });
//
//   socket.off("setup", () => {
//     console.log("User Disconnected");
//     socket.leave(userData._id);
//   });
// });
