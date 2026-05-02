const express = require('express');
const router = express.Router();

router.post('/explain-step', async (req, res) => {
  const { algorithm, arrayState, comparingIndices, stepNumber } = req.body;
  const anthropic = req.anthropic;

  // comparingIndices is expected to be an array, e.g., [i, j]
  const i = comparingIndices?.[0] ?? '?';
  const j = comparingIndices?.[1] ?? '?';
  const valI = arrayState?.[i] ?? '?';
  const valJ = arrayState?.[j] ?? '?';

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `The current step in ${algorithm}: 
Array state is ${JSON.stringify(arrayState)}. 
Comparing indices ${i} and ${j} with values ${valI} and ${valJ}. 
Explain this specific step in 2-3 simple sentences for a student.`
      }]
    });

    res.json({ explanation: response.content[0].text });
  } catch (error) {
    console.error('Error explaining step:', error);
    res.status(500).json({ error: 'Failed to explain step.' });
  }
});

module.exports = router;
