const express = require('express')
const router = express.Router()
const gen7info = require('./gen7info.js')

router.get('/', (req, res) => {
    res.json(gen7info)
})

module.exports = router;