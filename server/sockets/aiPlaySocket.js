const { generateRoomId, getNewGame } = require('./funcs');
const { getBestMove } = require('../ai/aiFuncs');

module.exports.aiPlaySocket = (io, socket) => {
	socket.on('create-ai-room', () => {
		const roomId = generateRoomId();

		const game = getNewGame();

		if (Math.random() < 0.5) {
			// AI plays a move
			const move = getBestMove(game.board, game.curPlayer);
			game.playMove(move.row, move.col);
		}

		global.roomToGameMap[roomId] = game;
		socket.room = roomId;

		socket.join(roomId);
		socket.emit('room-id', { room_id: roomId });
		socket.emit('game-data', { move: game.curPlayer, grid: game.board });
	});

	socket.on('play-ai', ({ roomId, row, col }) => {
		const game = global.roomToGameMap[roomId];

		const movePlayed = game.playMove(row, col);
		let gameResult = game.getGameResult();

		if (movePlayed && gameResult === undefined) {
			const move = getBestMove(game.board, game.curPlayer);
			game.playMove(move.row, move.col);
			gameResult = game.getGameResult();
		}

		io.sockets.in(roomId).emit('move-played', {
			movePlayed,
			row,
			col,
			result: gameResult,
			curGameGridState: game.board,
		});
	});

	socket.on('restart-ai', (roomId) => {
		const game = getNewGame();

		if (Math.random() < 0.5) {
			// AI plays a move
			const move = getBestMove(game.board, game.curPlayer);
			game.playMove(move.row, move.col);
		}

		global.roomToGameMap[roomId] = game;
		socket.emit('game-data', { move: game.curPlayer, grid: game.board });
	});
};
