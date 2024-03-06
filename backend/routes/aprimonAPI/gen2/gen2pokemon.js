const express = require('express')
const router = express.Router()
const gen2info = require('./gen2info.js')

router.get('/', (req, res) => {
    res.json(gen2info)
})

module.exports = router;