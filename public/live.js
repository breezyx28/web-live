const socket = io("/"); // listen to socket from root path "server.js"

const video = document.getElementById("video"); // mention video element

const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
let mediaSource = new MediaSource();

video.muted = true;
video.src = URL.createObjectURL(mediaSource);

(async () => {
  const sourceBuffer = await new Promise((resolve, reject) => {
    const getSourceBuffer = () => {
      try {
        const sourceBuffer = mediaSource.addSourceBuffer(
          'video/webm; codecs="vp9,opus"'
        );
        resolve(sourceBuffer);
      } catch (e) {
        console.log("live-error: ", e);
        reject(e);
      }
    };
    if (mediaSource.readyState === "open") {
      console.log("ready");
      getSourceBuffer();
    } else {
      console.log(mediaSource);
      console.log("not ready");
      mediaSource.addEventListener("sourceopen", getSourceBuffer);
    }
  });

  socket.on("radio-reciver", function (image) {
    const buff = image.buff;

    console.log(buff);

    // Now that we have an "open" source buffer, we can append to it
    sourceBuffer.appendBuffer(buff);
    // Listen for when append has been accepted and
    // You could alternative use `.addEventListener` here instead
    sourceBuffer.onupdateend = () => {
      // Nothing else to load
      //   mediaSource.endOfStream();
      // Start playback!
      // Note: this will fail if video is not muted, due to rules about
      // autoplay and non-muted videos
      video.play();
      //   video.addEventListener("loadedmetadata", () => {});
    };

    // Debug Info
    console.log(sourceBuffer, mediaSource);
  });
})();
