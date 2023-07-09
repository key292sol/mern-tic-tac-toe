import React, { useEffect, useState } from 'react';
import GameGrid from '../components/GameGrid';
import Loading from '../components/Loading';
import { io } from 'socket.io-client';

import { HOST } from '../utils/APIRoutes';

function PlayAI() {
	const [socket, setSocket] = useState(undefined);

	const [hasGameStarted, setHasGameStarted] = useState(false);

	const [gameGrid, setGameGrid] = useState(null);
	const [curPlayer, setCurPlayer] = useState(null);
	const [gameResult, setGameResult] = useState(undefined);
	const [roomId, setRoomId] = useState(null);
	const [mySign, setMySign] = useState(null);

	const getNewCurPlayer = (player) => (player === 'O' ? 'X' : 'O');

	useEffect(() => {
		setSocket(io(HOST));
	}, []);

	useEffect(() => {
		if (socket) {
			socket.emit('create-ai-room');
			socket.on('room-id', ({ room_id }) => {
				setRoomId(room_id);
			});

			socket.on('game-data', ({ move, grid }) => {
				setMySign(move);
				setHasGameStarted(true);
				setGameGrid(grid);
				setCurPlayer(move);
				setGameResult(undefined);
			});
		}
	}, [socket]);

	const handleClick = (row, col) => {
		let gridCopy = [[...gameGrid[0]], [...gameGrid[1]], [...gameGrid[2]]];
		gridCopy[row][col] = mySign;

		setCurPlayer(getNewCurPlayer);
		setGameGrid(gridCopy);
		socket.emit('play-ai', { roomId, row, col });
	};

	const gameEnded = (result) => {
		let msg;

		if (result === mySign) {
			msg = 'You won!!';
		} else if (result === 'D') {
			msg = 'The game was a draw';
		} else {
			msg = 'You lose';
		}

		setGameResult(msg);
		alert(msg);
	};

	const resetGame = () => {
		if (window.confirm('Restart game?')) {
			socket.emit('restart-ai', roomId);
		}
	};

	useEffect(() => {
		if (hasGameStarted) {
			socket.on(
				'move-played',
				({ movePlayed, row, col, result, whoPlayed, curGameGridState }) => {
					setGameGrid(curGameGridState);
					setCurPlayer(getNewCurPlayer);

					if (result) {
						gameEnded(result);
					}
				}
			);
		}
	}, [hasGameStarted]);

	return (
		<div className='main-container'>
			{!hasGameStarted ? (
				<>
					<h2>Initialising Game</h2>
					<Loading />
				</>
			) : (
				<div className='main-container'>
					{gameResult ? (
						<h2>{gameResult}</h2>
					) : (
						<h2>
							Current:{' '}
							<span>
								{curPlayer} {curPlayer === mySign ? '(You)' : '(AI)'}
							</span>
						</h2>
					)}
					<GameGrid gridState={gameGrid} handleClick={handleClick} />
					<div
						style={{
							display: 'flex',
							gap: '1rem',
						}}
					>
						<button className='rematch-button' onClick={resetGame}>
							Rematch
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default PlayAI;
