const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); 

const videoFilePath = path.join(__dirname, "../data/videos.json");

const readVideoFile = (callback) => {
  fs.readFile(videoFilePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, JSON.parse(data));
  });
};

const writeVideoFile = (videos, callback) => {
  fs.writeFile(videoFilePath, JSON.stringify({ videos }), (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null);
  });
};

router.get("/", (req, res) => {
  readVideoFile((err, data) => {
    if (err) {
      res.status(500).send("Error reading video data");
      return;
    }
    const videos = data.videos.map((video) => ({
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    }));
    res.json(videos);
  });
});

router.get("/:id", (req, res) => {
  const videoId = req.params.id;
  readVideoFile((err, data) => {
    if (err) {
      res.status(500).send("Error reading video data");
      return;
    }
    const video = data.videos.find((v) => v.id === videoId);
    if (video) {
      res.json(video);
    } else {
      res.status(404).send("Video not found");
    }
  });
});

router.post("/", (req, res) => {
  const { title, description } = req.body;

  readVideoFile((err, data) => {
    if (err) {
      res.status(500).send("Error reading video data");
      return;
    }

    const videos = data.videos;

    const newVideo = {
      id: uuidv4(),
      title,
      description,
      channel: "Michelle Mah",
      image: "http://localhost:3000/images/upload-video-preview.jpg",
      views: "10,420,304", 
      likes: "1,234,304", 
      duration: "5:26",
      video: "", 
      timestamp: Date.now(),
      comments: [],
    };

    videos.push(newVideo);

    writeVideoFile(videos, (err) => {
      if (err) {
        res.status(500).send("Error writing video data");
        return;
      }

      res.status(201).json(newVideo);
    });
  });
});

module.exports = router;
