const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VideoSchema = new Schema(
	{
		filePath: String,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		userNome: String,
		testeId: String
	},
	{
		timestamps: true
	}
);

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
