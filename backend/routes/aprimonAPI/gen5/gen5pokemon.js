const express = require('express')
const router = express.Router()
const gen5info = require('./gen5info.js')

router.get('/', (req, res) => {
    res.json(gen5info)
})

module.exports = router;