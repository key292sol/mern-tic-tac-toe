module.exports = class GameState {
	X = 'X';
	O = 'O';
	DRAW = 'D';

	constructor() {
		this.board = [
			['', '', ''],
			['', '', ''],
			['', '', ''],
		];
		this.players = {
			X: null,
			O: null,
		};
		this.curPlayer = 'O';
		this.gameResult = undefined;
	}

	setPlayerX(player) {
		this.players[this.X] = player;
	}

	setPlayerO(player) {
		this.players[this.O] = player;
	}

	getPlayerX() {
		return this.players[this.X];
	}

	getPlayerO() {
		return this.players[this.O];
	}

	playMove(row, col) {
		try {
			if (this.board[row][col] !== '') {
				return false;
			}

			this.board[row][col] = this.curPlayer;
			this.curPlayer = this.curPlayer === this.X ? this.O : this.X;
			return true;
		} catch (error) {}
	}

	getGameResult() {
		if (this.gameResult !== undefined) {
			return this.gameResult;
		}

		const result = GameState.getResult(this.board);
		if (result) {
			this.gameResult = result;
		}
		return result;
	}

	static getResult(grid) {
		// Check rows
		for (let i = 0; i < 3; i++) {
			if (grid[i][0] !== '') {
				if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
					return grid[i][0];
				}
			}
		}

		// Check cols
		for (let i = 0; i < 3; i++) {
			if (grid[0][i] !== '') {
				if (grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
					return grid[0][i];
				}
			}
		}

		// Check diagonals
		if (
			grid[1][1] !== '' &&
			((grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) ||
				(grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]))
		) {
			return grid[1][1];
		}

		// Are all cells filled
		let allFilled = true;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (grid[i][j] === '') {
					allFilled = false;
					break;
				}
			}
		}

		if (allFilled) {
			return 'D';
		}

		return undefined;
	}
};
