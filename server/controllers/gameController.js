// const nanoid = require('nanoid');

module.exports.getGameDetails = (req, res, next) => {
	const { roomId, myUid } = req.body;
	const game = global.roomToGameMap[roomId];

	if (game === undefined) {
		return res.json({ gameFound: false });
	}

	return res.json({
		gameFound: true,
		gameGrid: game.board,
		curPlayer: game.curPlayer,
		playas: game.getPlayerSign(myUid),
		gameResult: game.gameResult,
	});
};

module.exports.getNewUid = (req, res, next) => {
	let uniqueId =
		Date.now().toString(36) + Math.random().toString(36).substring(2);

	return res.json({
		uid: uniqueId,
	});
};
