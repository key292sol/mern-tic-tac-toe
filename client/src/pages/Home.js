import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

function Home() {
	const navigate = useNavigate();

	return (
		<div className='main-container' style={{ gap: '2rem' }}>
			<h1 className='heading'>TicTacToe</h1>
			<button
				className='home-button'
				onClick={(e) => {
					navigate('/play-local');
				}}
			>
				Play Locally
			</button>
			<button
				className='home-button'
				onClick={(e) => {
					navigate('/play-ai');
				}}
			>
				Play with AI
			</button>
			<button
				className='home-button'
				onClick={(e) => {
					navigate('/room/create');
				}}
			>
				Create Room
			</button>
			<button
				className='home-button'
				onClick={(e) => {
					navigate('/room/join');
				}}
			>
				Join Room
			</button>
		</div>
	);
}

export default Home;
