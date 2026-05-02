const API_BASE_URL = 'http://localhost:3000/api';

async function generateQuestion(topic, difficulty, playerScore, aiScore) {
  const res = await fetch(`${API_BASE_URL}/quiz/generate-question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty, playerScore, aiScore })
  });
  return await res.json();
}

async function askAITutor(topic, question, history) {
  const res = await fetch(`${API_BASE_URL}/explain/concept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, userQuestion: question, chatHistory: history })
  });
  return await res.json();
}

async function getHint(question, options) {
  const res = await fetch(`${API_BASE_URL}/hint/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, options })
  });
  return await res.json();
}

async function explainStep(algorithm, arrayState, indices) {
  const res = await fetch(`${API_BASE_URL}/visualizer/explain-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm, arrayState, comparingIndices: indices })
  });
  return await res.json();
}

window.API = {
  generateQuestion,
  askAITutor,
  getHint,
  explainStep
};
