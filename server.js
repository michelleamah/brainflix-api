const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

const videosRouter = require('./routes/videos');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/videos', videosRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});