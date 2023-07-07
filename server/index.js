const express = require('express');
const cors = require('cors');

const socket = require('socket.io');

const { gameRoutes } = require('./routes/gameRoutes');
const { multiPlayerSocket } = require('./sockets/multiPlayerSocket');
const { localPlaySocket } = require('./sockets/localPlaySocket');
const { aiPlaySocket } = require('./sockets/aiPlaySocket');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', gameRoutes);

const PORT = process.env.PORT || 4040;
const server = app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});

const io = socket(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

global.roomToGameMap = {};

io.on('connection', (socket) => {
	console.log('Socket connected', socket.id);

	localPlaySocket(io, socket);
	aiPlaySocket(io, socket);
	multiPlayerSocket(io, socket);

	socket.on('disconnect', () => {
		// Remove stuff connected to the user
		// user ID, their mappings, rooms

		const roomId = socket.room;
		if (roomId && io.sockets.adapter.rooms.get(roomId)?.size === 0) {
			delete global.roomToGameMap[roomId];
		}
	});
});
