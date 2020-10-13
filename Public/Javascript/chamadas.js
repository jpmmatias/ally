const videoGrid = document.querySelector('#video-grid');
const socket = io('/');
const video = document.createElement('video');
video.muted = true;

let videoStream;

navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		try {
			videoStream = stream;
			addVideoStream(video, videoStream);
		} catch (err) {
			console.log(err);
		}
	});

const addVideoStream = (video, stream) => {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
	videoGrid.append(video);
	console.log(video);
};
