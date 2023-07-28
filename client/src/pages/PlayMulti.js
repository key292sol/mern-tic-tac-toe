import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GameGrid from '../components/GameGrid';
import Loading from '../components/Loading';
import { GetGameRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { io } from 'socket.io-client';

import { HOST } from '../utils/APIRoutes';

function PlayMulti() {
	const navigate = useNavigate();
	const [socket, setSocket] = useState(undefined);

	const [hasGameStarted, setHasGameStarted] = useState(false);

	const [gameGrid, setGameGrid] = useState(null);
	const [curPlayer, setCurPlayer] = useState(null);
	const [gameResult, setGameResult] = useState(undefined);

	const [myUid, setMyUid] = useState(null);
	const [mySign, setMySign] = useState(undefined);

	// const [rematchButtonMsg, setRematchMsg] = useState('Restart');
	const [rematchSent, setRematchSent] = useState(false);

	const [searchParams, setSearchParams] = useSearchParams();
	// const mySign = searchParams.get('playas');
	const roomId = searchParams.get('room-id');

	const getNewCurPlayer = (player) => (player === 'O' ? 'X' : 'O');

	useEffect(() => {
		setSocket(io(HOST));
		const localUid = localStorage.getItem('ttt-uid');
		if (!localUid) {
			navigate('/');
		} else {
			setMyUid(localUid);
		}
	}, []);

	useEffect(() => {
		if (socket) {
			socket.emit('add-to-room', { roomId });
			socket.on('restart', ({ grid }) => {
				window.location.reload();
			});
		}
	}, [socket]);

	useEffect(() => {
		if (myUid) {
			(async () => {
				try {
					const res = await axios.post(GetGameRoute, { roomId, myUid });

					if (res.data.gameFound === false) {
						alert('Game Not Found');
						return;
					}

					setGameGrid(res.data.gameGrid);
					setMySign(res.data.playas);
					setCurPlayer(res.data.curPlayer);
					setHasGameStarted(true);

					if (res.data.gameResult) {
						setGameResult(res.data.gameResult);
					}
				} catch (error) {
					console.error(error);
				}
			})();
		}
	}, [myUid]);

	const handleClick = (row, col) => {
		let gridCopy = [[...gameGrid[0]], [...gameGrid[1]], [...gameGrid[2]]];
		gridCopy[row][col] = mySign;

		setCurPlayer(getNewCurPlayer);
		setGameGrid(gridCopy);
		socket.emit('play', { roomId, row, col });
	};

	const handleRematch = () => {
		socket.emit('restart', { roomId });
		// setRematchMsg('Waiting for opponent response');
		setRematchSent(true);
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

		if (result === mySign) {
			msg = 'You won!!';
		}
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

					if (!movePlayed || whoPlayed === mySign) {
						return;
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
					<h2>Getting Game Info</h2>
					<Loading />
				</>
			) : (
				<div className='main-container'>
					{gameResult ? (
						<h2>
							{gameResult === 'D' ? (
								'Draw'
							) : (
								<>{gameResult === mySign ? 'You won!!' : 'Opponent won'}</>
							)}
						</h2>
					) : (
						<h2>
							Current:{' '}
							<span>
								{curPlayer} {curPlayer === mySign ? '(You)' : '(Opponent)'}
							</span>
						</h2>
					)}
					<GameGrid
						gridState={gameGrid}
						disable={gameResult || mySign !== curPlayer}
						handleClick={handleClick}
					/>
					<div
						style={{
							display: 'flex',
							gap: '1rem',
						}}
					>
						<button
							className='rematch-button'
							onClick={() => handleRematch()}
							disabled={rematchSent}
						>
							{rematchSent ? 'Restart Waiting' : 'Rematch'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default PlayMulti;
