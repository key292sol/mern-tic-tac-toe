const { generateRoomId, getNewGame } = require('./funcs');

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
			global.roomToGameMap[roomId] = getNewGame();
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
