import React, { useState } from 'react';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

function JoinRoom({ socket }) {
	const [isJoining, setIsJoining] = useState(false);
	const navigate = useNavigate();

	const sendJoinRoom = (e) => {
		e.preventDefault();
		const roomId = e.target.roomId.value.trim();

		setIsJoining(true);

		socket.emit('join-room', roomId);

		socket.on('game-start', ({ gameStart }) => {
			navigate(`/room/play?playas=O&room-id=${roomId}`);
		});
	};

	return (
		<div className='main-container'>
			{isJoining ? (
				<>
					<h2>Joining the Room</h2>
					<Loading />
				</>
			) : (
				<>
					<form className='join-room-form' onSubmit={(e) => sendJoinRoom(e)}>
						<label>Enter Room ID:</label>
						<input
							type='text'
							name='roomId'
							placeholder='Room ID'
							autoFocus={true}
						/>
						<button type='submit'>Join</button>
					</form>
				</>
			)}
		</div>
	);
}

export default JoinRoom;
