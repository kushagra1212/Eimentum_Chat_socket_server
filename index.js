const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
require("dotenv").config();
app.use(cors());
const options = {
  cors: true,
  origins: ["https://eimentum.vercel.app/"],
};

// const options={
//         cors:true,
//         origins:["http://localhost:3000/","http://localhost:3000/main/messenger"]
//        }

const io = require("socket.io")(server, options);

const PORT = process.env.PORT || 8000;

app.use(express.json());

server.listen(PORT, () => console.log(`runnig on port ${PORT}`));

app.use("/", (req, res) => {
  res.send("server");
});
let users = [];

const addUserHandler = (username, socket_id) => {
  users.forEach((user) => {
    if (user.username === username) {
      return;
    }
  });

  users.push({ username, socket_id });
};
const removeUserHandler = (socket_id) => {
  return users.filter((user) => user.socket_id !== socket_id);
};
const getuser = (receiver) => {
  return users.find((user) => user.username === receiver);
};
io.on("connection", (socket) => {
  console.log("connected");

  socket.emit("Welcome", { message: "Welcome Buddy !" });
  socket.on("adduser", (username) => {
    const socket_id = socket.id;
    addUserHandler(username, socket_id);

    socket.emit("getuser", users);
  });
  socket.on("sendmessage", ({ receiver, sender, text }) => {
    let rec = getuser(receiver);

    io.to(rec.socket_id).emit("getmessage", {
      sender,
      text,
    });
  });
  socket.on("disconnect", () => {
    let socket_id = socket.id;
    users = removeUserHandler(socket_id);

    socket.emit("getuser", users);

    console.log("disconnected");
  });
});
