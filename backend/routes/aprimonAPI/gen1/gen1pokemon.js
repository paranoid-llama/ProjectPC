const express = require('express')
const router = express.Router()
const gen1info = require('./gen1info.js')

router.get('/', (req, res) => {
    res.json(gen1info)
})

module.exports = router;