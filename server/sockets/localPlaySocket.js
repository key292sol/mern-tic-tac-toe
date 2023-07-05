const crypto = require('crypto');
const GameState = require('../game/GameState');

const generateRoomId = () => {
	let roomId;
	do {
		roomId = crypto.randomBytes(3).toString('hex').toUpperCase();
	} while (roomId in global.roomToGameMap);
	return roomId;
};

module.exports.localPlaySocket = (io, socket) => {
	socket.on('create-local-room', () => {
		const roomId = generateRoomId();

		global.roomToGameMap[roomId] = new GameState();
		socket.room = roomId;

		socket.join(roomId);
		socket.emit('room-id', roomId);
	});

	socket.on('play-local', ({ roomId, row, col }) => {
		const game = global.roomToGameMap[roomId];
		const curPlayer = game.curPlayer;

		const movePlayed = game.playMove(row, col);
		const gameResult = game.getGameResult();

		io.sockets.in(roomId).emit('move-played', {
			movePlayed,
			row,
			col,
			whoPlayed: curPlayer,
			result: gameResult,
			curGameGridState: game.board,
		});
	});

	socket.on('restart', () => {
		global.roomToGameMap[roomId] = new GameState();
	});
};
