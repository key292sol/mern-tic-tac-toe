import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

import { HOST, GetNewUidRoute } from '../utils/APIRoutes';

function JoinRoom() {
	const [socket, setSocket] = useState(undefined);
	const [myUid, setMyUid] = useState(null);

	const [isJoining, setIsJoining] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setSocket(io(HOST));

		const localUid = localStorage.getItem('ttt-uid');
		if (localUid === null) {
			// Get new uid
			(async () => {
				try {
					const res = await axios.get(GetNewUidRoute);
					const uid = res.data.uid;
					console.log(uid);
					localStorage.setItem('ttt-uid', uid);
					setMyUid(uid);
				} catch (error) {
					console.error(error);
				}
			})();
		} else {
			setMyUid(localUid);
		}
	}, []);

	const sendJoinRoom = (e) => {
		e.preventDefault();
		const roomId = e.target.roomId.value.trim();

		setIsJoining(true);

		socket.emit('join-room', { roomId, myUid });

		socket.on('game-start', ({ gameStart }) => {
			navigate(`/room/play?room-id=${roomId}`);
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
