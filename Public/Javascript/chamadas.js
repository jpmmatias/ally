const videoGrid = document.querySelector('#video-grid');
const socket = io('/');
let userStream;
let otherUser;
let peerRef;
let senders = [];
const começarGravarBtn = document.getElementById("gravar");
const videogravacao = document.getElementById("gravacao")
const pararGravarBtn = document.getElementById("parar");
let userVideo = document.createElement('video');
const btnCompartilhar = document.querySelector('#compartilharTela');
const btnPararDeCompartilhar = document.querySelector('#pararDeCompartilhar');
let partnerVideo;
let recorder;

userVideo.muted = true;

const pegarID = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[4];
	return ROOM_ID;
};

const tryReconnect =  ()=> {
	if (socket.socket.connected === false && socket.socket.connecting === false) {
		socket.socket.connect();
	}
};

let intervalID = setInterval(tryReconnect, 2000);

const callUser = (userID)=> {
	peerRef = createPeer(userID);
	userStream
		.getTracks()
		.forEach((track) => senders.push(peerRef.addTrack(track, userStream)));
}

const createPeer = (userID)=> {
	const peer = new RTCPeerConnection({
		iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
		],
	});
	peer.onicecandidate = handleICECandidateEvent;
	peer.ontrack = handleTrackEvent;
	peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

	return peer;
}

const handleNegotiationNeededEvent = (userID)=> {
	peerRef
		.createOffer()
		.then((offer) => {
			return peerRef.setLocalDescription(offer);
		})
		.then(() => {
			const payload = {
				target: userID,
				caller: socket.id,
				sdp: peerRef.localDescription,
			};
			socket.emit('offer', payload);
		})
		.catch((e) => console.log(e));
}

const handleRecieveCall = (incoming)=> {
	peerRef = createPeer();
	const desc = new RTCSessionDescription(incoming.sdp);
	peerRef
		.setRemoteDescription(desc)
		.then(() => {
			userStream
				.getTracks()
				.forEach((track) => peerRef.addTrack(track, userStream));
		})
		.then(() => {
			return peerRef.createAnswer();
		})
		.then((answer) => {
			return peerRef.setLocalDescription(answer);
		})
		.then(() => {
			const payload = {
				target: incoming.caller,
				caller: socket.id,
				sdp: peerRef.localDescription,
			};
			socket.emit('answer', payload);
		});
}

const handleAnswer=(message)=> {
	const desc = new RTCSessionDescription(message.sdp);
	peerRef.setRemoteDescription(desc).catch((e) => console.log(e));
}

const handleICECandidateEvent = (e)=> {
	if (e.candidate) {
		const payload = {
			target: otherUser,
			candidate: e.candidate,
		};
		socket.emit('ice-candidate', payload);
	}
}

const handleNewICECandidateMsg = (incoming)=> {
	const candidate = new RTCIceCandidate(incoming);
	peerRef.addIceCandidate(candidate).catch((e) => console.log(e));
	
}

const handleTrackEvent=(e)=> {
	videoGrid.appendChild(partnerVideo);
	partnerVideo.srcObject = e.streams[0];
	partnerVideo.addEventListener('loadedmetadata', () => {
		partnerVideo.play();
	});
}

const addVideoStream=(video, stream)=> {
	videoGrid.appendChild(video);
	video.srcObject = stream;
	userStream = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
}

const shareScreen= async () =>{
	btnPararDeCompartilhar.style.display = 'block';
	btnCompartilhar.style.display = 'none';
	await navigator.mediaDevices.getDisplayMedia({cursor: true}).then((stream) => {
		const screenTrack = stream.getTracks()[0];
		if (senders.length > 0) {
			senders
				.find((sender) => sender.track.kind === 'video')
				.replaceTrack(screenTrack);
				 addVideoStream(userVideo, stream);
		}
		screenTrack.onended=()=>{
			pararDeCompartilharF()
		}
	}) ;
}

const pararDeCompartilharF = async () =>{
	btnPararDeCompartilhar.style.display = 'none';
	btnCompartilhar.style.display = 'block';
	await navigator.mediaDevices.getUserMedia({video: true,
		audio: true}).then((stream) => {
		addVideoStream(userVideo, stream);
		senders.find((sender) => sender.track.kind === 'video').replaceTrack(stream.getVideoTracks()[0])
		
	}) 
}

const videoUpload = (videoUrl)=> {
	let id = pegarID()
	let url = URL.createObjectURL(videoUrl);
	let	fileReader = new FileReader()
	fileReader.readAsDataURL( videoUrl )
	fileReader.onload=(e)=>{
		let fd = new FormData();
		fd.append('video',videoUrl,`${id}_${Date.now()}.mp4`)
		return fetch(`https://allyticc.herokuapp.com//testes/${id}/chamada/videoUpload`,{
			method: 'POST', 
			body:fd,
		}).then((res)=>{
			console.log(res)
		}).catch(err=>{
			console.log(err)
		})
	}
	   }

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		addVideoStream(userVideo, stream);
		socket.emit('join room', pegarID());
		socket.on('other user', (userID) => {
			callUser(userID);
			otherUser = userID;
		});
		socket.on('offer', handleRecieveCall);
		socket.on('answer', handleAnswer);
		socket.on('ice-candidate', handleNewICECandidateMsg);
	})
	.catch((err) => console.log(err));

começarGravarBtn.addEventListener("click", async ()=>{
	 userStream = await navigator.mediaDevices.getDisplayMedia({
		video: { mediaSource: "screen" }
	  });
	recorder = new MediaRecorder(userStream);
	const chunks = [];
	recorder.ondataavailable = e => chunks.push(e.data);
	recorder.onstop = e => {
	  const completeBlob = new Blob(chunks, {  'type' : 'video/mp4;' });
	
	 videogravacao.src = URL.createObjectURL(completeBlob);
	  videoUpload(completeBlob)
	  videogravacao.controls=true
	};
  
	recorder.start();
} );

pararGravarBtn.addEventListener("click", () => {
	pararGravarBtn.setAttribute("disabled", true);
	começarGravarBtn.removeAttribute("disabled");
	recorder.stop();
  });

socket.on('connect', () => {
	clearInterval(intervalID);
	socket.emit('roomID', pegarID());
});

socket.on('disconnect', () => {
	socket.disconnect();
});

socket.on('userLeft', () => {
	partnerVideo.remove();
});

socket.on('criarOutroUserVideo', () => {
	partnerVideo = document.createElement('video');
});

btnCompartilhar.addEventListener('click', shareScreen);

btnPararDeCompartilhar.addEventListener('click', pararDeCompartilharF);




   