import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { HOST, GetNewUidRoute } from '../utils/APIRoutes';
import axios from 'axios';

function CreateRoom() {
	const [socket, setSocket] = useState(undefined);
	const [myUid, setMyUid] = useState(null);

	const [roomId, setRoomId] = useState(undefined);
	const navigate = useNavigate();

	useEffect(() => {
		setSocket(io(HOST));

		const localUid = localStorage.getItem('ttt-uid');
		// const localUid = localStorage['ttt-uid'];
		console.log(localUid);
		if (!localUid) {
			// Get new uid
			(async () => {
				try {
					const res = await axios.get(GetNewUidRoute);
					const uid = res.data.uid;
					setMyUid(uid);
					localStorage.setItem('ttt-uid', uid);
				} catch (error) {
					console.error(error);
				}
			})();
		} else {
			setMyUid(localUid);
		}
	}, []);

	useEffect(() => {
		if (socket && myUid) {
			socket.emit('create-room', { myUid });
			let URL;
			socket.on('room-id', (room_id) => {
				setRoomId(room_id);
				URL = `/room/play?room-id=${room_id}`;
			});

			socket.on('game-start', ({ gameStart }) => {
				navigate(URL);
			});
		}
	}, [socket, myUid]);

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
