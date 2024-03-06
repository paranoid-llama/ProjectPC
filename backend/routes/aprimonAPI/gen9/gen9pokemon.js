const express = require('express')
const router = express.Router()
const gen9info = require('./gen9info.js')

router.get('/', (req, res) => {
    res.json(gen9info)
})

module.exports = router;