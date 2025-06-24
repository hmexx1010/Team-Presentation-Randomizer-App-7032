import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Fun adjectives for mic-drop reasons
const ADJECTIVES = [
  'brilliant', 'charismatic', 'dynamic', 'innovative', 'inspiring',
  'legendary', 'magnificent', 'outstanding', 'phenomenal', 'remarkable',
  'spectacular', 'unstoppable', 'visionary', 'witty', 'zealous',
  'amazing', 'creative', 'energetic', 'fantastic', 'incredible'
];

// API endpoint for generating mic-drop reasons
app.post('/api/mic-drop-reason', async (req, res) => {
  try {
    const { presenter } = req.body;
    
    if (!presenter) {
      return res.status(400).json({ error: 'Presenter name is required' });
    }

    // If OpenAI API key is provided, use GPT-4
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a witty assistant that creates fun, one-sentence "mic-drop reasons" for why someone should present next. Be playful, positive, and include their name. Keep it under 20 words and make it energetic!'
              },
              {
                role: 'user',
                content: `Create a fun mic-drop reason for ${presenter} to present next.`
              }
            ],
            max_tokens: 50,
            temperature: 0.9,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reason = data.choices[0]?.message?.content?.trim();
          
          if (reason) {
            return res.json({ reason });
          }
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
      }
    }

    // Fallback: Generate a fun reason locally
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const templates = [
      `${presenter} is absolutely ${adjective} and ready to blow everyone's minds! 🤯`,
      `The ${adjective} ${presenter} has been chosen by the presentation gods! ⚡`,
      `${presenter}'s ${adjective} energy is exactly what we need right now! 🔥`,
      `Time for ${presenter} to unleash their ${adjective} superpowers! 💫`,
      `The incredibly ${adjective} ${presenter} is destined for mic greatness! 🎤`,
      `${presenter} brings that ${adjective} magic we've all been waiting for! ✨`,
      `Our ${adjective} champion ${presenter} is ready to steal the show! 🌟`,
      `${presenter}'s ${adjective} brilliance cannot be contained any longer! 💎`
    ];

    const reason = templates[Math.floor(Math.random() * templates.length)];
    
    res.json({ reason });
  } catch (error) {
    console.error('Error generating mic-drop reason:', error);
    res.status(500).json({ 
      error: 'Failed to generate mic-drop reason',
      reason: `${req.body.presenter} is ready to drop some knowledge! 🎤`
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🎤 Who Gets the Mic? server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  
  if (process.env.OPENAI_API_KEY) {
    console.log('🤖 OpenAI API integration enabled');
  } else {
    console.log('🎲 Using fallback reason generator (set OPENAI_API_KEY for AI-powered reasons)');
  }
});