const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const videoFilePath = path.join(__dirname, '../data/videos.json');

const readVideoFile = (callback) => {
  fs.readFile(videoFilePath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, JSON.parse(data));
  });
};

router.get('/', (req, res) => {
  readVideoFile((err, data) => {
    if (err) {
      res.status(500).send('Error reading video data');
      return;
    }
    const videos = data.videos.map(video => ({
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    }));
    res.json(videos);
  });
});

router.get('/:id', (req, res) => {
  const videoId = req.params.id;
  readVideoFile((err, data) => {
    if (err) {
      res.status(500).send('Error reading video data');
      return;
    }
    const video = data.videos.find(v => v.id === videoId);
    if (video) {
      res.json(video);
    } else {
      res.status(404).send('Video not found');
    }
  });
});

module.exports = router;
