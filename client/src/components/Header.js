import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

function Header({ socket, setSocket }) {
	useEffect(() => {
		if (socket === undefined) {
			const HOST = 'http://localhost:4040';
			setSocket(io(HOST));
		}
	}, []);
	return (
		<header>
			<Link to={'/'}>Home</Link>
		</header>
	);
}

export default Header;
