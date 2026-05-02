const express = require('express');
const router = express.Router();

router.post('/concept', async (req, res) => {
  const { topic, userQuestion, chatHistory } = req.body;
  const anthropic = req.anthropic;

  // chatHistory should be an array of objects: { role: 'user' | 'assistant', content: '...' }
  const messages = chatHistory || [];
  
  if (userQuestion) {
    messages.push({ role: 'user', content: userQuestion });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: "You are an expert DAA (Design and Analysis of Algorithms) tutor. Explain concepts clearly with examples and code snippets. Keep answers concise and student-friendly. Use simple language suitable for B.Tech CS students.",
      messages: messages
    });

    res.json({
      response: response.content[0].text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error explaining concept:', error);
    res.status(500).json({ error: 'Failed to get explanation from AI tutor.' });
  }
});

module.exports = router;
