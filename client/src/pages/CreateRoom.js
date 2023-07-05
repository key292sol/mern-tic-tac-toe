import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

function CreateRoom({ socket }) {
	const [roomId, setRoomId] = useState(undefined);
	const navigate = useNavigate();

	useEffect(() => {
		if (socket) {
			socket.emit('create-room');
			let URL;
			socket.on('room-id', (room_id) => {
				setRoomId(room_id);
				URL = `/room/play?playas=X&room-id=${room_id}`;
			});

			socket.on('game-start', ({ gameStart }) => {
				navigate(URL);
			});
			/* socket.on('game-start', ({ gameStart, playAs }) => {
			navigate(`/room?playas=${playAs}`);
		}); */
		}
	}, []);

	return (
		<div
			className='main-container'
			style={{
				gap: '1rem',
			}}
		>
			{roomId ? (
				<>
					<h1>Room ID:</h1>
					<h2>{roomId}</h2>
					<p style={{ fontSize: '0.75em' }}>
						Share this Room ID with your friend and you can play each other
					</p>
				</>
			) : (
				<>
					<h2>Creating Room ID</h2>
					<Loading />
				</>
			)}
		</div>
	);
}

export default CreateRoom;
