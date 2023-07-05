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

		if (!socket) {
			alert('There was a problem connecting to server');
			return;
		}

		socket.emit('join-room', roomId);

		socket.on('game-start', ({ gameStart }) => {
			navigate(`/room/play?playas=O&room-id=${roomId}`);
		});
	};

	/* socket.on('game-start', ({ gameStart, playAs }) => {
		navigate(`/room?playas=${playAs}`);
	});

	socket.on('not-joined', () => {
		alert("Couldn't find the room ID specified");
		setIsJoining(false);
	}); */

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
