const videoGrid = document.querySelector('#video-grid');
const socket = io('/');
let userStream;
let otherUser;
let peerRef;
let senders = [];
let userVideo = document.createElement('video');
let btnCompartilhar = document.querySelector('#compartilharTela');
let btnPararDeCompartilhar = document.querySelector('#pararDeCompartilhar');

const submitTarefa = document.querySelector('#anotacoes');

let partnerVideo;

btnCompartilhar.addEventListener('click', shareScreen);
btnPararDeCompartilhar.addEventListener('click', pararDeCompartilhar);

userVideo.muted = true;

const pegarID = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[4];
	return ROOM_ID;
};
var tryReconnect = function () {
	if (socket.socket.connected === false && socket.socket.connecting === false) {
		// use a connect() or reconnect() here if you want
		socket.socket.connect();
	}
};

var intervalID = setInterval(tryReconnect, 2000);

socket.on('connect', () => {
	clearInterval(intervalID);
	//partnerVideo = document.createElement('video');
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

function callUser(userID) {
	peerRef = createPeer(userID);
	userStream
		.getTracks()
		.forEach((track) => senders.push(peerRef.addTrack(track, userStream)));
}

function createPeer(userID) {
	const peer = new RTCPeerConnection({
		iceServers: [
			{
				urls: 'stun:stun.stunprotocol.org',
			},
			{
				urls: 'turn:numb.viagenie.ca',
				credential: 'muazkh',
				username: 'webrtc@live.com',
			},
		],
	});
	peer.onicecandidate = handleICECandidateEvent;
	peer.ontrack = handleTrackEvent;
	peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

	return peer;
}

function handleNegotiationNeededEvent(userID) {
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

function handleRecieveCall(incoming) {
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

function handleAnswer(message) {
	const desc = new RTCSessionDescription(message.sdp);
	peerRef.setRemoteDescription(desc).catch((e) => console.log(e));
}

function handleICECandidateEvent(e) {
	if (e.candidate) {
		const payload = {
			target: otherUser,
			candidate: e.candidate,
		};
		socket.emit('ice-candidate', payload);
	}
}

function handleNewICECandidateMsg(incoming) {
	const candidate = new RTCIceCandidate(incoming);

	peerRef.addIceCandidate(candidate).catch((e) => console.log(e));
}

function handleTrackEvent(e) {
	videoGrid.appendChild(partnerVideo);
	partnerVideo.srcObject = e.streams[0];
	partnerVideo.addEventListener('loadedmetadata', () => {
		partnerVideo.play();
	});
}

function addVideoStream(video, stream) {
	videoGrid.appendChild(video);
	video.srcObject = stream;
	userStream = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
}

function shareScreen() {
	btnPararDeCompartilhar.style.display = 'block';
	btnCompartilhar.style.display = 'none';
	navigator.mediaDevices.getDisplayMedia({cursor: true}).then((stream) => {
		const screenTrack = stream.getTracks()[0];
		if (senders.length > 0) {
			senders
				.find((sender) => sender.track.kind === 'video')
				.replaceTrack(screenTrack);
			addVideoStream(userVideo, stream);
		}
	});
}

submitTarefa.addEventListener('click', sendForm);

const sendFomrm = (e) => {
	e.preventDefault();
	let id = pegarID();
	let ajax = new XMLHttpRequest();
	ajax.open('PUT', `http://localhost:5000/testes/${id}/chamada`);
	ajax.onreadystatechange = () => {
		console.log(ajax.response);
	};
	ajax.send();
	return false;
};
