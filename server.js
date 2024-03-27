const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

// set our engine
app.set("view engine", "ejs"); // set in view engine
app.use(express.static("public")); // using public folder as base folder

// streamer view
app.get("/streamer", (req, res) => {
  res.render("streamer");
});

app.get("/live", (req, res) => {
  res.render("live");
});

app.get("/canvas-stream", (req, res) => {
  res.render("viewCanvasStream");
});

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
// socket part
io.on("connection", (socket) => {
  socket.on("radio", function (image) {
    console.log(image);
    socket.broadcast.emit("radio-reciver", { count: 1, buff: image });
  });
  // when socket connect
  socket.on("join-room", (roomId, userId) => {
    // create this event "join-room" and it should accept "roomId,userId" as a params
    // we should get result after emiting this event inside this callback

    // telling all user of the same room that we have a new user joined the room
    // first we have to make this current user room to join the socket so we can notice any attemp of this room connection
    socket.join(roomId); // joining current room to socket server || every one who join this room we will send it to this room

    socket.to(roomId).emit("user-connected", userId); // we will send a message to everyone else in this room "roomId"
    console.log("user id", userId);
  });
});

server.listen(3030);
