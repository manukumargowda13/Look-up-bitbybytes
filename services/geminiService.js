const axios = require('axios');
const { GROQ_API_URL } = require('../config/constants');

const extractAnswer = (payload) => {
  return payload?.choices?.[0]?.message?.content || null;
};

const askGemini = async (question) => {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('Groq Loaded');
  console.log('Groq API Key present:', Boolean(apiKey));

  if (!apiKey) {
    const err = new Error('Groq API key is not configured. Please add GROQ_API_KEY to your environment.');
    err.statusCode = 500;
    throw err;
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `Your core directive is to assist with queries related to space, astronomy, satellite tracking, orbital mechanics, and space technology.

Strict Rules:
1. Scope Filter: ONLY answer questions directly related to space, astronomy, satellites, cosmology, astrophysics, space weather, and space flight.
2. No Pivoting/Bridging: If the question is NOT directly about space (e.g. general biology, body functions, unrelated foods, politics, everyday life, coding, recipes), you MUST refuse to answer. Do NOT try to connect, bridge, or pivot the irrelevant topic to space.
3. Refusal Format: For any irrelevant questions, output exactly: "I am a dedicated Space Intelligence system. Please ask a question related to space, astronomy, satellites, or orbital intelligence." and nothing else.
4. Structure: If the question is relevant, keep responses concise, precise, and organized using bullet points. Avoid long, unstructured paragraphs.
5. Style: Maintain a professional, futuristic, mission-control officer tone. Do not use emojis.`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 12000
      }
    );

    const answer = extractAnswer(response.data);
    return answer || 'Groq returned an unexpected response. Please try again later.';
  } catch (error) {
    console.error('[Groq Error]', error.response ? error.response.data : error.message || error);
    const message = error.response
      ? `Groq API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
      : `Groq API error: ${error.message}`;
    const err = new Error(message);
    err.statusCode = error.response?.status || 500;
    throw err;
  }
};

module.exports = { askGemini };
