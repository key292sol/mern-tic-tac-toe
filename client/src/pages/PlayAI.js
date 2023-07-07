import React, { useEffect, useState } from 'react';
import GameGrid from '../components/GameGrid';
import Loading from '../components/Loading';

function PlayAI({ socket }) {
	const [hasGameStarted, setHasGameStarted] = useState(false);

	const [gameGrid, setGameGrid] = useState(null);
	const [curPlayer, setCurPlayer] = useState(null);
	const [gameResult, setGameResult] = useState(undefined);
	const [roomId, setRoomId] = useState(null);
	const [mySign, setMySign] = useState(null);

	const getNewCurPlayer = (player) => (player === 'O' ? 'X' : 'O');

	useEffect(() => {
		if (socket) {
			socket.emit('create-ai-room');
			socket.on('room-id', ({ room_id, move, grid }) => {
				console.log(move);
				setMySign(move);
				setHasGameStarted(true);
				setGameGrid(grid);
				setCurPlayer(move);
				setGameResult(undefined);
				setRoomId(room_id);
			});
		}
	}, []);

	const handleClick = (row, col) => {
		if (socket) {
			let gridCopy = [[...gameGrid[0]], [...gameGrid[1]], [...gameGrid[2]]];
			gridCopy[row][col] = mySign;

			setCurPlayer(getNewCurPlayer);
			setGameGrid(gridCopy);
			socket.emit('play-ai', { roomId, row, col });
		} else {
			alert("Couldn't connect to server");
		}
	};

	const gameEnded = (result) => {
		// setGameResult(result);
		let msg;

		if (result === mySign) {
			console.log(result, mySign);
			msg = 'You won!!';
		} else if (result === 'D') {
			msg = 'The game was a draw';
		} else {
			msg = 'You lose';
		}

		setGameResult(msg);
		alert(msg);
	};

	useEffect(() => {
		if (hasGameStarted) {
			socket.on(
				'move-played',
				({ movePlayed, row, col, result, whoPlayed, curGameGridState }) => {
					if (result) {
						gameEnded(result);
					}

					// gameGrid[row][col] =  curPlayer ;
					setGameGrid(curGameGridState);
					setCurPlayer(getNewCurPlayer);
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
						<h2>
							{gameResult}
							{/* {gameResult === 'D' ? (
								'Draw'
							) : (
								<>{gameResult === mySign ? 'You won!!' : 'AI won'}</>
							)} */}
						</h2>
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
						<button className='rematch-button'>Rematch</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default PlayAI;
