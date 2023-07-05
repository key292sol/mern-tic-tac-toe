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
		if (this.board[row][col] !== '') {
			return false;
		}

		this.board[row][col] = this.curPlayer;
		this.curPlayer = this.curPlayer === this.X ? this.O : this.X;
		return true;
	}

	getGameResult() {
		if (this.gameResult !== undefined) {
			return this.gameResult;
		}

		let hasEnded = false;

		// Check rows
		for (let i = 0; i < 3; i++) {
			if (this.board[i][0] !== '') {
				if (
					this.board[i][0] === this.board[i][1] &&
					this.board[i][1] === this.board[i][2]
				) {
					this.gameResult = this.board[i][0];
					return this.gameResult;
				}
			}
		}

		// Check cols
		for (let i = 0; i < 3; i++) {
			if (this.board[0][i] !== '') {
				if (
					this.board[0][i] === this.board[1][i] &&
					this.board[1][i] === this.board[2][i]
				) {
					this.gameResult = this.board[0][i];
					return this.gameResult;
				}
			}
		}

		// Check diagonals
		if (
			this.board[1][1] !== '' &&
			((this.board[0][0] === this.board[1][1] &&
				this.board[1][1] === this.board[2][2]) ||
				(this.board[0][2] === this.board[1][1] &&
					this.board[1][1] === this.board[2][0]))
		) {
			this.gameResult = this.board[1][1];
			return this.gameResult;
		}

		// Are all cells filled
		let allFilled = true;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.board[i][j] === '') {
					allFilled = false;
					break;
				}
			}
		}

		if (allFilled && this.gameResult === undefined) {
			this.gameResult = this.DRAW;
			return this.gameResult;
		}

		this.gameResult = undefined;
		return this.gameResult;
	}
};
