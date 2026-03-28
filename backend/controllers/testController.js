const User = require('../models/User');

/**
 * Evaluates skill test and updates user rating.
 * Discrete Mathematics Concept: Mathematical Evaluation of scoring.
 */
const submitTest = async (req, res, next) => {
  try {
    const { testId, userAnswers } = req.body;
    const userId = req.user.id; // From protect middleware
    
    // Correct answers mapping (Aligned with SkillTest.jsx)
    // 1. Virtual DOM (A)
    // 2. Props (C)
    // 3. useEffect (D)
    // 4. useState (B)
    // 5. JSX (A)
    const correctAnswers = ["A", "C", "D", "B", "A"];
    let correctCount = 0;
    
    for(let i = 0; i < correctAnswers.length; i++) {
        if(userAnswers[i] === correctAnswers[i]) {
            correctCount++;
        }
    }
    
    const percentage = (correctCount / correctAnswers.length) * 100;
    
    // Update User Rating (ADA Concept: Score Accumulation)
    // Each correct answer adds to the rating.
    const ratingIncrement = correctCount * 10;
    
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { rating: ratingIncrement } },
        { new: true }
    );
    
    res.json({ 
        message: 'Test evaluated successfully!', 
        score: correctCount,
        total: correctAnswers.length,
        percentage: `${percentage}%`,
        newRating: updatedUser.rating,
        ratingAdded: ratingIncrement
    });
    
  } catch (error) {
    console.error('Submit Test Error:', error);
    next(error);
  }
};

module.exports = { submitTest };
