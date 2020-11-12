const socket = io('/');
let isMuted;
let recorder  
let userStream
let videogravacao = document.createElement('video')
let videoIsPaused;
let dataChanel = null;
const browserName = getBrowserName();
const url = window.location.href;
const roomHash = url.substring(url.lastIndexOf("/") + 1).toLowerCase();
let mode = "camera";
let sendingCaptions = false;
let receivingCaptions = false;
const isWebRTCSupported =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia ||
  window.RTCPeerConnection;
const remoteVideoVanilla = document.getElementById("remote-video");
const remoteVideo = $("#remote-video");
const captionText = $("#remote-video-text");
const localVideoText = $("#local-video-text");
const captionButtontext = $("#caption-button-text");
const pegarID = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[4];
	return ROOM_ID;
};

const videoUpload = (videoUrl)=> {
	let id = pegarID()
	let url = URL.createObjectURL(videoUrl);
	let	fileReader = new FileReader()
	fileReader.readAsDataURL( videoUrl )
	fileReader.onload=(e)=>{
		let fd = new FormData();
		fd.append('video',videoUrl,`${id}_${Date.now()}.mp4`)
		return fetch(`http://localhost:5000/testes/${id}/chamada/videoUpload`,{
			method: 'POST', 
			body:fd,
		}).then((res)=>{
			console.log(res)
		}).catch(err=>{
			console.log(err)
		})
	}
     }

let VideoChat = {
  connected: false,
  willInitiateCall: false,
  localICECandidates: [],
  socket: io(),
  remoteVideo: document.getElementById("remote-video"),
  localVideo: document.getElementById("local-video"),
  recognition: undefined,



  requestMediaStream: function (event) {
    logIt("requestMediaStream");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        VideoChat.onMediaStream(stream);
       
      })
      .catch((error) => {
        logIt(error);
        logIt(
          "Falha ao obter vídeo da webcam local, verifique as configurações de privacidade da webcam"
        );
        
        setTimeout(VideoChat.requestMediaStream, 1000);
      });
  },

  
  onMediaStream: function (stream) {
    logIt("onMediaStream");
    VideoChat.localStream = stream;
    VideoChat.localVideo.srcObject = stream;
    VideoChat.socket.emit("join", roomHash);
    VideoChat.socket.on("full", chatRoomFull);
    VideoChat.socket.on("offer", VideoChat.onOffer);
    VideoChat.socket.on("ready", VideoChat.readyToCall);
    VideoChat.socket.on(
      "willInitiateCall",
      () => (VideoChat.willInitiateCall = true)
    );
  },

  readyToCall: function (event) {
    logIt("readyToCall");
    if (VideoChat.willInitiateCall) {
      logIt("Initiating call");
      VideoChat.startCall();
    }
  },

  startCall: function (event) {
    logIt("startCall >>> Sending token request...");
    VideoChat.socket.on("token", VideoChat.onToken(VideoChat.createOffer));
    VideoChat.socket.emit("token", roomHash);
  },

  onToken: function (callback) {
    logIt("onToken");
    return function (token) {
      logIt("<<< Received token");
      VideoChat.peerConnection = new RTCPeerConnection({
        iceServers: token.iceServers,
      });
      VideoChat.localStream.getTracks().forEach(function (track) {
        VideoChat.peerConnection.addTrack(track, VideoChat.localStream);
      });

      dataChanel = VideoChat.peerConnection.createDataChannel("chat", {
        negotiated: true,
       
        id: 0,
      });
      dataChanel.onopen = function (event) {
        logIt("dataChannel opened");
      };
      dataChanel.onmessage = function (event) {
        const receivedData = event.data;
        const dataType = receivedData.substring(0, 4);
        const cleanedMessage = receivedData.slice(4);
        if (dataType === "mes:") {
          handleRecieveMessage(cleanedMessage);
        } else if (dataType === "cap:") {
          recieveCaptions(cleanedMessage);
        } else if (dataType === "tog:") {
          toggleSendCaptions();
        }
      };
      VideoChat.peerConnection.onicecandidate = VideoChat.onIceCandidate;
      VideoChat.peerConnection.onaddstream = VideoChat.onAddStream;
      VideoChat.socket.on("candidate", VideoChat.onCandidate);
      VideoChat.socket.on("answer", VideoChat.onAnswer);
      VideoChat.socket.on("requestToggleCaptions", () => toggleSendCaptions());
      VideoChat.socket.on("recieveCaptions", (captions) =>
        recieveCaptions(captions)
      );
      VideoChat.peerConnection.oniceconnectionstatechange = function (event) {
        switch (VideoChat.peerConnection.iceConnectionState) {
          case "connected":
            logIt("connected");
            VideoChat.socket.disconnect();
            break;
          case "disconnected":
            logIt("disconnected");
          case "failed":
            logIt("failed");
            location.reload();
            break;
          case "closed":
            logIt("closed");
            break;
        }
      };
      callback();
    };
  },

  onIceCandidate: function (event) {
    logIt("onIceCandidate");
    if (event.candidate) {
      logIt(
        `<<< Received local ICE candidate from STUN/TURN server (${event.candidate.address})`
      );
      if (VideoChat.connected) {
        logIt(`>>> Sending local ICE candidate (${event.candidate.address})`);
        VideoChat.socket.emit(
          "candidate",
          JSON.stringify(event.candidate),
          roomHash
        );
      } else {
        VideoChat.localICECandidates.push(event.candidate);
      }
    }
  },


  onCandidate: function (candidate) {
    captionText.text("Found other user... connecting");
    rtcCandidate = new RTCIceCandidate(JSON.parse(candidate));
    logIt(
      `onCandidate <<< Received remote ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`
    );
    VideoChat.peerConnection.addIceCandidate(rtcCandidate);
  },

  createOffer: function () {
    logIt("createOffer >>> Creating offer...");
    VideoChat.peerConnection.createOffer(
      function (offer) {
        VideoChat.peerConnection.setLocalDescription(offer);
        VideoChat.socket.emit("offer", JSON.stringify(offer), roomHash);
      },
      function (err) {
        logIt("failed offer creation");
        logIt(err, true);
      }
    );
  },


  createAnswer: function (offer) {
    logIt("createAnswer");
    return function () {
      logIt(">>> Creating answer...");
      rtcOffer = new RTCSessionDescription(JSON.parse(offer));
      VideoChat.peerConnection.setRemoteDescription(rtcOffer);
      VideoChat.peerConnection.createAnswer(
        function (answer) {
          VideoChat.peerConnection.setLocalDescription(answer);
          VideoChat.socket.emit("answer", JSON.stringify(answer), roomHash);
        },
        function (err) {
          logIt("Failed answer creation.");
          logIt(err, true);
        }
      );
    };
  },


  onOffer: function (offer) {
    logIt("onOffer <<< Received offer");
    VideoChat.socket.on(
      "token",
      VideoChat.onToken(VideoChat.createAnswer(offer))
    );
    VideoChat.socket.emit("token", roomHash);
  },

  onAnswer: function (answer) {
    logIt("onAnswer <<< Received answer");
    var rtcAnswer = new RTCSessionDescription(JSON.parse(answer));
    VideoChat.peerConnection.setRemoteDescription(rtcAnswer);
    VideoChat.localICECandidates.forEach((candidate) => {
      logIt(`>>> Sending local ICE candidate (${candidate.address})`);
      VideoChat.socket.emit("candidate", JSON.stringify(candidate), roomHash);
    });
    VideoChat.localICECandidates = [];
  },

  onAddStream: function (event) {
    logIt("onAddStream <<< Received new stream from remote. Adding it...");
    VideoChat.remoteVideo.srcObject = event.stream;
    VideoChat.remoteVideo.style.background = "none";
    VideoChat.connected = true;
    captionText.fadeOut();
  },
};

function getBrowserName() {
  var name = "Unknown";
  if (window.navigator.userAgent.indexOf("MSIE") !== -1) {
  } else if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
    name = "Firefox";
  } else if (window.navigator.userAgent.indexOf("Opera") !== -1) {
    name = "Opera";
  } else if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
    name = "Chrome";
  } else if (window.navigator.userAgent.indexOf("Safari") !== -1) {
    name = "Safari";
  }
  return name;
}

function logIt(message, error) {
  console.log(message);
}

function chatRoomFull() {
  alert(
    "A sala de bate-papo está cheia. Verifique se você não tem várias guias abertas ou tente usar um novo link de sala"
  );
  window.location.href = "/dashboard";
}


function rePositionCaptions() {
  var bounds = remoteVideo.position();
  bounds.top -= 10;
  bounds.top = bounds.top + remoteVideo.height() - 1 * captionText.height();
  captionText.css(bounds);
}

function windowResized() {
  rePositionLocalVideo();
  rePositionCaptions();
}


function muteMicrophone() {
  var audioTrack = null;
  VideoChat.peerConnection.getSenders().find(function (s) {
    if (s.track.kind === "audio") {
      audioTrack = s.track;
    }
  });
  isMuted = !audioTrack.enabled;
  audioTrack.enabled = isMuted;
  isMuted = !isMuted;
  const micButtonIcon = document.getElementById("mic-icon");
  const micButtonText = document.getElementById("mic-text");
  if (isMuted) {
    micButtonIcon.classList.remove("fa-microphone");
    micButtonIcon.classList.add("fa-microphone-slash");
    micButtonText.innerText = "Unmute";
  } else {
    micButtonIcon.classList.add("fa-microphone");
    micButtonIcon.classList.remove("fa-microphone-slash");
    micButtonText.innerText = "Mute";
  }
}
function swap() {
  if (!VideoChat.connected) {
    alert("Você precia estar em uma chamada para compartilhar a tela");
    return;
  }
  const swapIcon = document.getElementById("swap-icon");
  const swapText = document.getElementById("swap-text");
  if (mode === "camera") {
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: false,
      })
      .then(function (stream) {
        mode = "screen";
        swapIcon.classList.remove("fa-desktop");
        swapIcon.classList.add("fa-camera");
        swapText.innerText = "Share Webcam";
        switchStreamHelper(stream);
        recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
          const completeBlob = new Blob(chunks, {  'type' : 'video/mp4;' });
          videogravacao.src = URL.createObjectURL(completeBlob);
          videoUpload(completeBlob)
        };
        recorder.start();
      })
      .catch(function (err) {
        logIt(err);
        logIt("Erro em compartilhar a tela");
      });
  } else {
    recorder.stop();
    VideoChat.localVideo.srcObject.getTracks().forEach((track) => track.stop());

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then(function (stream) {
        mode = "camera";
        swapIcon.classList.remove("fa-camera");
        swapIcon.classList.add("fa-desktop");
        swapText.innerText = "Share Screen";
        switchStreamHelper(stream);
      });
  }
}

function switchStreamHelper(stream) {
  let videoTrack = stream.getVideoTracks()[0];
  videoTrack.onended = function () {
    swap();
  };
  if (VideoChat.connected) {
    const sender = VideoChat.peerConnection.getSenders().find(function (s) {
      return s.track.kind === videoTrack.kind;
    });
    sender.replaceTrack(videoTrack);
  }
  VideoChat.localStream = videoTrack;
  VideoChat.localVideo.srcObject = stream;
  if (videoIsPaused) {
    pauseVideo();
  }
}

function requestToggleCaptions() {
  if (!VideoChat.connected) {
    alert("Você deve estar conectado a um par para usar Live Caption");
    return;
  }
  if (receivingCaptions) {
    captionText.text("").fadeOut();
    captionButtontext.text("Start Live Caption");
    receivingCaptions = false;
  } else {
    captionButtontext.text("End Live Caption");
    receivingCaptions = true;
  }
  dataChanel.send("tog:");
}

function toggleSendCaptions() {
  if (sendingCaptions) {
    sendingCaptions = false;
    VideoChat.recognition.stop();
  } else {
    startSpeech();
    sendingCaptions = true;
  }
}

function startSpeech() {
  try {
    var SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    VideoChat.recognition = new SpeechRecognition();
  } catch (e) {
    sendingCaptions = false;
    logIt(e);
    logIt("error importing speech library");
    dataChanel.send("cap:notusingchrome");
    return;
  }
  VideoChat.recognition.continuous = true;
  VideoChat.recognition.interimResults = true;
  var finalTranscript;
  VideoChat.recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
      var transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
        var charsToKeep = interimTranscript.length % 100;
        dataChanel.send(
          "cap:" +
            interimTranscript.substring(interimTranscript.length - charsToKeep)
        );
      }
    }
  };
  VideoChat.recognition.onend = function () {
    logIt("on speech recording end");
    if (sendingCaptions) {
      startSpeech();
    } else {
      VideoChat.recognition.stop();
    }
  };
  VideoChat.recognition.start();
}

function recieveCaptions(captions) {
  if (receivingCaptions) {
    captionText.text("").fadeIn();
  } else {
    captionText.text("").fadeOut();
  }
  if (captions === "notusingchrome") {
    alert(
      "Outro chamador deve estar usando o Chrome para que este recurso funcione. Live Caption desativada."
    );
    receivingCaptions = false;
    captionText.text("").fadeOut();
    captionButtontext.text("Start Live Caption");
    return;
  }
  captionText.text(captions);
  rePositionCaptions();
}

function addMessageToScreen(msg, isOwnMessage) {
  if (isOwnMessage) {
    $(".chat-messages").append(
      '<div class="message-item customer cssanimation fadeInBottom"><div class="message-bloc"><div class="message">' +
        msg +
        "</div></div></div>"
    );
  } else {
    $(".chat-messages").append(
      '<div class="message-item moderator cssanimation fadeInBottom"><div class="message-bloc"><div class="message">' +
        msg +
        "</div></div></div>"
    );
  }
}




function togglePictureInPicture() {
  if (
    "pictureInPictureEnabled" in document ||
    remoteVideoVanilla.webkitSetPresentationMode
  ) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch((error) => {
        logIt("Error exiting pip.");
        logIt(error);
      });
    } else if (remoteVideoVanilla.webkitPresentationMode === "inline") {
      remoteVideoVanilla.webkitSetPresentationMode("picture-in-picture");
    } else if (
      remoteVideoVanilla.webkitPresentationMode === "picture-in-picture"
    ) {
      remoteVideoVanilla.webkitSetPresentationMode("inline");
    } else {
      remoteVideoVanilla.requestPictureInPicture().catch((error) => {
        alert(
          "Você deve estar conectado a outra pessoa para entrar imagem na imagem.");
      });
    }
  } else {
    alert(
      "Imagem em imagem não é compatível com seu navegador. Considere usar o Chrome ou Safari."    );
  }
}

function startUp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  if (
    DetectRTC.isMobileDevice &&
    (ua.indexOf("FBAN") > -1 ||
      ua.indexOf("FBAV") > -1 ||
      ua.indexOf("Instagram") > -1)
  ) {
    if (DetectRTC.osName === "iOS") {
      window.location.href = "/notsupportedios";
    } else {
      window.location.href = "/notsupported";
    }
  }

  if (DetectRTC.isMobileDevice) {
    if (DetectRTC.osName === "iOS" && !DetectRTC.browser.isSafari) {
      window.location.href = "/notsupportedios";
    }
  }

  if (!isWebRTCSupported || browserName === "MSIE") {
    window.location.href = "/notsupported";
  }

  document.title = "Ally - Teste";

  VideoChat.requestMediaStream();

  captionText.text("").fadeOut();



  $(".HoverState").hide();


  $(document).ready(function () {
    $(".hoverButton").mouseover(function () {
      $(".HoverState").hide();
      $(this).next().show();
    });
    $(".hoverButton").mouseout(function () {
      $(".HoverState").hide();
    });
  });

  var timedelay = 1;
  function delayCheck() {
    if (timedelay === 5) {
      $("#header").fadeOut();
      timedelay = 1;
    }
    timedelay = timedelay + 1;
  }
  $(document).mousemove(function () {
    $(".multi-button").fadeIn();
    $("#header").fadeIn();
    $(".multi-button").style = "";
    timedelay = 1;
    clearInterval(_delay);
    _delay = setInterval(delayCheck, 500);
  });
  _delay = setInterval(delayCheck, 500);

  captionText.text("Esperando usuário entrar...").fadeIn();

  rePositionCaptions();

  navigator.mediaDevices.ondevicechange = () => window.location.reload();
}




startUp();




   