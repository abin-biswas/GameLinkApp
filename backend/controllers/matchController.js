const Match = require('../models/Match');

exports.playerLikesOrganization = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.playerLiked = true;
    if (match.orgLiked) {
      match.status = 'matched';
    }
    await match.save();

    res.json({ match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like organization', error: error.message });
  }
};

exports.organizationLikesPlayer = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.orgLiked = true;
    if (match.playerLiked) {
      match.status = 'matched';
    }
    await match.save();

    res.json({ match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like player', error: error.message });
  }
};