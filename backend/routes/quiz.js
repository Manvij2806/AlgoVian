const express = require('express');
const router = express.Router();

router.post('/generate-question', async (req, res) => {
  const { topic, difficulty, playerScore, aiScore } = req.body;
  const anthropic = req.anthropic;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Generate 1 multiple choice question about ${topic} for a DAA quiz. 
        Difficulty: ${difficulty}. The player score is ${playerScore} and AI score is ${aiScore}. Adapt the difficulty accordingly (easy if player is losing, hard if player is winning).
        Return JSON only without markdown formatting. Format must be:
        { "question": "...", "options": ["opt1", "opt2", "opt3", "opt4"], "correct_index": 0, "explanation": "..." }`
      }]
    });

    const textContent = response.content[0].text;
    // Extract JSON from response text in case Claude adds surrounding text
    const jsonStr = textContent.substring(textContent.indexOf('{'), textContent.lastIndexOf('}') + 1);
    const parsedData = JSON.parse(jsonStr);

    res.json({ ...parsedData, difficulty });
  } catch (error) {
    console.error('Error generating question:', error);
    // Fallback response
    res.status(500).json({
      question: `Fallback question: What is the time complexity of ${topic}?`,
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'],
      correct_index: 1,
      explanation: 'This is a fallback question generated because the AI request failed.',
      difficulty
    });
  }
});

module.exports = router;
