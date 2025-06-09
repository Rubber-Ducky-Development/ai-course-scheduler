// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware - enable CORS with proper settings
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5173'], // Allow both React and Vite default ports
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.post('/api/schedule', (req, res) => {
  console.log("Received form data:", req.body);

  // Fake schedule as plain text
  const fakeResponse = `
Schedule 1
COMP 1405 - Intro to CS - MWF 10:30-11:30 - Southam Hall
MATH 1007 - Calc I - TTh 12:00-13:30 - Herzberg 214

Schedule 2
COMP 1405 - Intro to CS - MWF 13:30-14:30 - Southam Hall
MATH 1007 - Calc I - TTh 15:00-16:30 - Herzberg 214
`;

  res.send(fakeResponse);
});

app.listen(PORT, () => {
  console.log(`Fake backend running at http://localhost:${PORT}`);
});
