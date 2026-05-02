const express = require('express');
const router = express.Router();

router.post('/get', async (req, res) => {
  const { question, options } = req.body;
  const anthropic = req.anthropic;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Give a helpful hint for this DAA question without revealing the answer:
Question: ${question}
Options: ${JSON.stringify(options)}
Hint should be 1-2 sentences maximum.`
      }]
    });

    res.json({ hint: response.content[0].text });
  } catch (error) {
    console.error('Error generating hint:', error);
    res.status(500).json({ error: 'Failed to generate hint.' });
  }
});

module.exports = router;
