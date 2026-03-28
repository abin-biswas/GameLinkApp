const express = require('express');
const { playerLikesOrganization, organizationLikesPlayer } = require('../controllers/matchController');

const router = express.Router();

router.patch('/matches/:matchId/player-like', playerLikesOrganization);
router.patch('/matches/:matchId/org-like', organizationLikesPlayer);

module.exports = router;
