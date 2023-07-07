import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Outlet,
	useLocation,
} from 'react-router-dom';

import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import PlayLocal from './pages/PlayLocal';

import { useState } from 'react';
import Header from './components/Header';
import PlayMulti from './pages/PlayMulti';
import PlayAI from './pages/PlayAI';

function App() {
	const [socket, setSocket] = useState(undefined);

	const Layout = () => {
		const { pathname } = useLocation();
		return (
			<>
				{!(pathname === '/') && (
					<Header socket={socket} setSocket={setSocket} />
				)}
				{/* <Header /> */}
				<Outlet />
			</>
		);
	};

	return (
		<Router>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />}></Route>
					<Route
						path='/play-local'
						element={<PlayLocal socket={socket} />}
					></Route>
					<Route path='/play-ai' element={<PlayAI socket={socket} />}></Route>
					<Route
						path='/room/create'
						element={<CreateRoom socket={socket} />}
					></Route>
					<Route
						path='/room/join'
						element={<JoinRoom socket={socket} />}
					></Route>
					<Route
						path='/room/play'
						element={<PlayMulti socket={socket} />}
					></Route>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
