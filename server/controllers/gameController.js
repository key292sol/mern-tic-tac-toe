module.exports.getGameDetails = (req, res, next) => {
	// console.log(req.body);
	// console.log(global.roomToGameMap);

	const { roomId } = req.body;
	const game = global.roomToGameMap[roomId];

	if (game === undefined) {
		console.log(roomId);
		console.log(global.roomToGameMap);
		return res.json({ gameFound: false });
	}

	return res.json({
		gameFound: true,
		gameGrid: game.board,
		curPlayer: game.curPlayer,
		gameResult: game.gameResult,
	});
};
