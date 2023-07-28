const { generateRoomId, getNewGame } = require('./funcs');
// const nanoid = require('nanoid');

module.exports.multiPlayerSocket = (io, socket) => {
	socket.on('create-room', ({ myUid }) => {
		const roomId = generateRoomId();

		const game = getNewGame();
		global.roomToGameMap[roomId] = game;
		game.setPlayerX(myUid);

		socket.room = roomId;

		socket.join(roomId);
		socket.emit('room-id', roomId);
	});

	socket.on('join-room', ({ roomId, myUid }) => {
		const roomExists = roomId in global.roomToGameMap;

		if (!roomExists) {
			socket.emit('not-joined', false);
		} else {
			// global.roomToGameMap[roomId] = getNewGame();
			let game = global.roomToGameMap[roomId];
			game.setPlayerO(myUid);
			socket.room = roomId;

			socket.join(roomId);

			io.sockets.in(roomId).emit('game-start', { gameStart: true });
		}
	});

	socket.on('add-to-room', ({ roomId }) => {
		socket.room = roomId;
		socket.join(roomId);
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

	socket.on('restart', ({ roomId }) => {
		const game = global.roomToGameMap[roomId];
		game.incRestart();
		if (game.getRestartCount() === 2) {
			const newGame = getNewGame();
			newGame.setPlayerX(game.getPlayerO());
			newGame.setPlayerO(game.getPlayerX());
			global.roomToGameMap[roomId] = newGame;

			io.sockets.in(roomId).emit('restart', { grid: game.board });
		}
	});
};
