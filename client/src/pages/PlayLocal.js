import React, { useEffect, useState } from 'react';
import GameGrid from '../components/GameGrid';
import Loading from '../components/Loading';

function PlayLocal({ socket }) {
	const [hasGameStarted, setHasGameStarted] = useState(false);

	const [gameGrid, setGameGrid] = useState(null);
	const [curPlayer, setCurPlayer] = useState(null);
	const [gameResult, setGameResult] = useState(undefined);
	const [roomId, setRoomId] = useState(null);

	const getNewCurPlayer = (player) => (player === 'O' ? 'X' : 'O');

	const setDefaultStates = () => {
		setHasGameStarted(true);
		setGameGrid([
			['', '', ''],
			['', '', ''],
			['', '', ''],
		]);
		setCurPlayer('O');
		setGameResult(undefined);
	};

	useEffect(() => {
		if (socket) {
			socket.emit('create-local-room');
			socket.on('room-id', (room_id) => {
				console.log(room_id);
				setDefaultStates();
				setRoomId(room_id);
			});
		}
	}, []);

	const handleClick = (row, col) => {
		if (socket) {
			let gridCopy = [[...gameGrid[0]], [...gameGrid[1]], [...gameGrid[2]]];
			gridCopy[row][col] = curPlayer;

			setCurPlayer(getNewCurPlayer);
			setGameGrid(gridCopy);
			socket.emit('play-local', { roomId, row, col });
		} else {
			alert("Couldn't connect to server");
		}
	};

	const gameEnded = (result) => {
		setGameResult(result);
		let msg;
		switch (result) {
			case 'D':
				msg = 'The game was a draw';
				break;
			case 'X':
				msg = 'Winner: X';
				break;
			case 'O':
				msg = 'Winner: O';
				break;
			default:
				break;
		}

		alert(msg);
		// console.log(msg);
	};

	useEffect(() => {
		if (hasGameStarted) {
			console.log('INIT move played');
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
						<h2>{gameResult === 'D' ? 'DRAW' : `Winner: ${gameResult}`}</h2>
					) : (
						<h2>
							Current: <span>{curPlayer}</span>
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

export default PlayLocal;
