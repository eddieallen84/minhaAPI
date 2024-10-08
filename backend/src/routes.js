const express = require('express');
const router = express.Router();
const users = require('../users');

router.get('/', (req, res) => {
  res.send("REQUISIÇÃO OK");
});

router.get('/users', (req, res) => {
  res.send(users);
});



module.exports = router;
