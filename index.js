const express = require('express');
const { data } = require('./data.js');
const port = process.env.PORT || 3000; // Use the port provided by the host or default to 3000

const app = express();
  
// Middleware to parse JSON requests
app.use(express.json());

// Create (POST) a new item
app.post('/items', (req, res) => {
  const newItem = req.body;
  data.push(newItem);
  res.status(201).json(newItem);
});

// Read (GET) all items
app.get('/items', (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

 // Define a route to handle incoming requests
 app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });