const crypto = require('crypto');
const GameState = require('../game/GameState');

module.exports.generateRoomId = () => {
	let roomId;
	do {
		roomId = crypto.randomBytes(3).toString('hex').toUpperCase();
	} while (roomId in global.roomToGameMap);
	return roomId;
};

module.exports.getNewGame = () => new GameState();
