const videoGrid = document.querySelector('#video-grid');
const socket = io('/');
let userStream;
let otherUser;
let peerRef;
let userVideo = document.querySelector('#userVideo');
let partnerVideo = document.querySelector('#partnerVideo');

userVideo.muted = true;
const pegarID = () => {
	let url = window.location.href;
	let urlSeparado = url.split('/');
	let ROOM_ID = urlSeparado[4];
	return ROOM_ID;
};

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		addVideoStream(userVideo, stream);
		console.log(userVideo);
		socket.emit('join room', pegarID());
		socket.on('other user', (userID) => {
			callUser(userID);
			otherUser = userID;
		});
		socket.on('offer', handleRecieveCall);
		socket.on('answer', handleAnswer);
		socket.on('ice-candidate', handleNewICECandidateMsg);
	});

function callUser(userID) {
	peerRef = createPeer(userID);
	userStream
		.getTracks()
		.forEach((track) => peerRef.addTrack(track, userStream));
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
	partnerVideo.srcObject = e.streams[0];
	partnerVideo.addEventListener('loadedmetadata', () => {
		partnerVideo.play();
	});
}

function addVideoStream(video, stream) {
	video.srcObject = stream;
	userStream = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
}
