const express = require('express');
const { getAllPlayers, getAllOrganizations } = require('../controllers/profileController');

const router = express.Router();

router.get('/players', getAllPlayers);
router.get('/organizations', getAllOrganizations);

module.exports = router;
