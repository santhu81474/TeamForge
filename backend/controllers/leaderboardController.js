const User = require('../models/User');
const { mergeSortUsers } = require('../utils/mathUtils');

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password from rank payloads
    
    // Discrete Mathematics: Ranking via custom O(n log n) stable sorting structure
    const sortedUsers = mergeSortUsers(users);
    
    res.json(sortedUsers);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };
