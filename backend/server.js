const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Attach Anthropic client to req so routes can use it
app.use((req, res, next) => {
  req.anthropic = client;
  next();
});

app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/explain', require('./routes/explain'));
app.use('/api/hint', require('./routes/hint'));
app.use('/api/visualizer', require('./routes/step'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AlgoArena backend running on port ${PORT}`));
