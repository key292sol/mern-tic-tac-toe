const GameState = require('../game/GameState');

module.exports.getBestMove = (grid, curPlayer, rowPlayed, colPlayed) => {
	const res = GameState.getResult(grid);

	if (res !== undefined) {
		let ret = { res: 0, row: rowPlayed, col: colPlayed };
		if (res === 'D') {
			ret.res = 0;
		} else {
			ret.res = -1;
		}
		return ret;
	}

	let bestMove = { res: -10 };
	const otherPlayer = curPlayer === 'X' ? 'O' : 'X';

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (grid[i][j] === '') {
				grid[i][j] = curPlayer;
				const res = this.getBestMove(grid, otherPlayer, i, j);
				res.res = -res.res;
				grid[i][j] = '';

				if (bestMove.res < res.res) {
					bestMove = res;
					bestMove.row = i;
					bestMove.col = j;
				}
			}
		}
	}

	return bestMove;
};
