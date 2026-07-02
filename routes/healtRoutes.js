const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 500).json({
    status: isConnected ? 'UP' : 'DOWN',
    database: isConnected ? 'CONNECTED' : 'DISCONNECTED',
    timestamp: new Date()
  });
});

module.exports = router;
