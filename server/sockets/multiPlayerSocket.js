const crypto = require('crypto');

const generateRoomId = () => {
	let roomId;
	do {
		roomId = crypto.randomBytes(3).toString('hex').toUpperCase();
	} while (roomId in global.roomToGameMap);
	return roomId;
};

module.exports.multiPlayerSocket = (io, socket) => {
	socket.on('create-room', () => {
		const roomId = generateRoomId();

		global.roomToGameMap[roomId] = null;
		socket.room = roomId;

		socket.join(roomId);
		socket.emit('room-id', roomId);
	});

	socket.on('join-room', (roomId) => {
		const roomExists = roomId in global.roomToGameMap;

		if (!roomExists) {
			socket.emit('not-joined', false);
		} else {
			global.roomToGameMap[roomId] = new GameState();
			socket.room = roomId;

			socket.join(roomId);

			io.sockets.in(roomId).emit('game-start', { gameStart: true });
		}
	});

	socket.on('play', ({ roomId, row, col }) => {
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

	socket.on('restart', () => {});
};
