const PlayerProfile = require('../models/PlayerProfile');
const OrgProfile = require('../models/OrgProfile');

exports.createPlayerProfile = async (req, res) => {
  try {
    const { userId, game, rank, role, playstyle, availability, clips } = req.body;

    const profile = await PlayerProfile.create({
      userId,
      game,
      rank,
      role,
      playstyle,
      availability,
      clips,
    });

    res.status(201).json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create player profile', error: error.message });
  }
};

exports.createOrgProfile = async (req, res) => {
  try {
    const { userId, teamName, game, requiredRoles, minRank } = req.body;

    const profile = await OrgProfile.create({
      userId,
      teamName,
      game,
      requiredRoles,
      minRank,
    });

    res.status(201).json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create organization profile', error: error.message });
  }
};

exports.getAllPlayers = async (req, res) => {
  try {
    const players = await PlayerProfile.find().populate('userId', 'email role');
    res.json({ players });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch player profiles', error: error.message });
  }
};

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await OrgProfile.find().populate('userId', 'email role');
    res.json({ organizations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch organization profiles', error: error.message });
  }
};
