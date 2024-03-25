const socket = io("/"); // listen to socket from root path "server.js"

// const connectToNewUser = require("./stream");
const videoGrid = document.getElementById("video-grid"); // mention video element
const myPeer = new Peer("123", {
  host: "/",
  port: "3001",
}); // peer allow us to genarate user id instead of hard coded id --- undefined will force peer to genarate an ID for us
const myVideo = document.createElement("video"); // create video element
myVideo.muted = true; // MUTE our video

var conn = myPeer.connect("breezy");

myPeer.on("error", (err) => {
  console.log(err);
});

myPeer.on("call", (call) => {
  const getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  getUserMedia(
    {
      video: true,
    },
    (mediaStream) => {
      call.answer(mediaStream);
      addVideoStream(myVideo, mediaStream);
      const options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        mimeType: `video/webm; codecs="vp9,opus"`,
      };
      var media = new MediaRecorder(mediaStream);

      console.log(media);

      media.ondataavailable = function (e) {
        socket.emit("radio", e.data);
        console.log(e.data);
        // conn.send(e.data);
      };

      media.start(10000);

      // conn.on("open", function () {
      //   console.log("its opened");
      //   // Send messages
      // });
    }
  );
});

// config our media device "camera, microphone"
// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     addVideoStream(myVideo, stream);

//     myPeer.on("call", (call) => {
//       call.answer(stream);
//     });

//   });

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
