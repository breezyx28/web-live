const socket = io("/"); // listen to socket from root path "server.js"

// const connectToNewUser = require("./stream");
const videoGrid = document.getElementById("video-grid"); // mention video element
const myVideo = document.createElement("video"); // create video element
myVideo.muted = true; // MUTE our video

/////////--------------------------
let canvas = document.getElementById("preview");
let context = canvas.getContext("2d");
let log = document.getElementById("log");
canvas.width = 900;
canvas.height = 700;
context.width = canvas.width;
context.height = canvas.height;
/////////--------------------------

function logger(msg) {
  log.innerText = msg;
}

function Draw(video, context) {
  context.drawImage(video, 0, 0, context.width, context.height);
  console.log(canvas.toDataURL("image/webp"));
  socket.emit("radio", canvas.toDataURL("image/webp"));
}

const getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

getUserMedia(
  {
    video: true,
  },
  (mediaStream) => {
    logger("Camera connected");
    addVideoStream(myVideo, mediaStream);

    setInterval(function () {
      Draw(myVideo, context);
    }, 0.01);
  }
);

// video stream handler
function addVideoStream(video, stream) {
  // our src video prop will have stream variable on it "src='stream'"
  video.srcObject = stream;
  // once our stream video loaded on screen this event will be fired and play the video for us
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
