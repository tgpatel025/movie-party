const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const ffmpeg = 'C:/Data/Uploads';
const dbService = require('../services/database.service');
const websocket = require('../websocket');
const webSocketStatus = require('../constants/websocket-status');
const videoStatus = require('../constants/video-status');
const videoConfig = require('../config/video.config');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.access('C:/Data/Uploads', (err) => {
      if (err) {
        console.log(err);
      }
    });
    if (!fs.existsSync(`C:/Data/Uploads/${req.params.id}`)) {
      fs.mkdir(`C:/Data/Uploads/${req.params.id}`, (err) => {
        console.log(err);
      });
    }
    cb(null, `C:/Data/Uploads/${req.params.id}`)
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`)
  }
});

const upload = multer({ storage });

router.post('/video-metadata', (req, res, next) => {
  dbService.addVideoMetadata(req).then(guid => {
    res.status(200).json({ guid });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});

router.post('/upload/:id', upload.single('chunk'), (req, res, next) => {
  const videoId = req.params.id;
  const filename = req.body.filename;
  const folder = `C:/Data/Uploads/${videoId}`;
  fs.readFile(`${folder}/${filename}`, (readErr, data) => {
    if (readErr) {
      console.log(readErr);
      dbService.updateVideoStatus(videoStatus.ERROR, videoId);
      res.status(500).json({ 'error': readErr });
    } else {
      const ext = path.extname(req.body.originalFileName);
      fs.appendFile(`${folder}/${videoId}${ext}`, data, (appendErr) => {
        if (appendErr) {
          console.log(appendErr);
          dbService.updateVideoStatus(videoStatus.ERROR, videoId);
          res.status(500).json({ 'error': appendErr });
        } else {
          fs.rm(`${folder}/${filename}`, (removeError) => {
            if (removeError) {
              console.log(removeError);
              dbService.updateVideoStatus(videoStatus.ERROR, videoId);
              res.status(500).json({ 'error': removeError });
            } else {
              const percentage = Math.floor((req.body.chunkNo * 100) / req.body.totalChunks);
              if (req.body.chunkNo === req.body.totalChunks) {
                res.status(200).json({ status: "Done..!", percentage });
                const { video, audio, manifest } = videoConfig.getVideoPlaybackCommand(`${folder}/${videoId}${ext}`, folder);
                exec(audio + ' && ' + video + ' && ' + manifest, () => {
                  dbService.updateVideoStatus(videoStatus.DONE, videoId);
                  websocket.sendMessasge({
                    status: webSocketStatus.VIDEO_STATUS,
                    connectionId: req.body.connectionId,
                    videoId,
                    videoStatus: videoStatus.DONE
                  });
                });
              } else {
                res.status(200).json({ status: "Partially Done..!", percentage });
              }
            }
          });
        }
      });
    }
  });
});

router.get('/get-file/:id/:filename', (req, res) => {
  res.sendFile(`C:/Data/Uploads/${req.params.id}/${req.params.filename}`);
});

router.get('/get-video-list', (req, res) => {
  dbService.getVideoList().then(result => {
    res.status(200).json({ result });
  }).catch(error => {
    res.status(500).json({ error });
  });
});

module.exports = router;
