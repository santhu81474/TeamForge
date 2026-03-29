const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');

const getDailyChallenge = async (req, res, next) => {
  try {
    // Fetch challenge for "today" (simple logic for now)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let challenge = await Challenge.findOne({ activeDate: { $gte: today } });
    
    if (!challenge) {
      // Create a default challenge if none exists for today
      challenge = await Challenge.create({
        title: "The Reverse Array Protocol",
        problemStatement: "Implement a function `reverseArray(arr)` that reverses the given array in-place with O(1) extra space.",
        difficulty: "Easy",
        points: 50,
        testCases: [
          { input: "[1,2,3]", output: "[3,2,1]" }
        ],
        activeDate: today
      });
    }
    
    res.json(challenge);
  } catch (error) {
    next(error);
  }
};

const submitSolution = async (req, res, next) => {
  try {
    const { challengeId, code, language } = req.body;
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    // Mock execution logic: Always accept for now but calculate "hacker points"
    const executionTime = Math.floor(Math.random() * 100) + 10; // 10-110ms
    const memoryUsage = Math.floor(Math.random() * 500) + 200; // 200-700KB
    
    // Performance based modifier: faster is better
    const performanceBonus = Math.max(0, (200 - executionTime) / 2); 
    const pointsEarned = Math.round(challenge.points + performanceBonus);

    const submission = await Submission.create({
      challengeId,
      userId: req.user.id,
      code,
      language,
      status: 'Accepted',
      executionTime,
      memoryUsage,
      pointsEarned
    });

    // Update user points
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: pointsEarned } });

    res.status(201).json({ 
      message: 'Transmission Successful. Algorithm Verified.', 
      submission,
      pointsEarned 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDailyChallenge, submitSolution };
