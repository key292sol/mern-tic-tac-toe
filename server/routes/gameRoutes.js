const { getGameDetails, getNewUid } = require('../controllers/gameController');

const gameRoutes = require('express').Router();
gameRoutes.post('/getGame', getGameDetails);
gameRoutes.get('/getNewUid', getNewUid);
module.exports = { gameRoutes };
