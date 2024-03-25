const socket = io("/"); // listen to socket from root path "server.js"

// const video = document.getElementById("video"); // mention video element
const play = document.getElementById("play"); // mention video element
const log = document.getElementById("log"); // mention video element

socket.on("radio-reciver", function (image) {
  play.setAttribute("src", image.buff);
  log.innerText = image;
});
