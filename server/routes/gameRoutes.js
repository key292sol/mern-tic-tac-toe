const { getGameDetails } = require('../controllers/gameController');

const gameRoutes = require('express').Router();
gameRoutes.post('/getGame', getGameDetails);
module.exports = { gameRoutes };
