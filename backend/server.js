const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Route to receive activity events
app.post('/api/events', (req, res) => {
  const event = req.body;
  console.log('📝 Received event:', event);
  res.status(200).json({ message: 'Event received successfully' });
});

// Root route
app.get('/', (req, res) => {
  res.send('VS Code Activity Tracker Backend is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
