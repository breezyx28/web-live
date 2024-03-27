const socket = io("/"); // listen to socket from root path "server.js"
const video = document.getElementById("video"); // mention video element

const myPeer = new Peer("abc", {
  host: "/",
  port: "3031",
  secure: false,
}); // peer allow us to genarate user id instead of hard coded id --- undefined will force peer to genarate an ID for us

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    const call = myPeer.call("123", stream);

    call.on("stream", (remoteStream) => {
      addStreamerVideoStream(remoteStream);
    });
  });

// video stream handler
function addStreamerVideoStream(stream) {
  // our src video prop will have stream variable on it "src='stream'"
  video.srcObject = stream;
  // once our stream video loaded on screen this event will be fired and play the video for us
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  console.log();
}
