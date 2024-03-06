const express = require('express')
const router = express.Router()
const gen3info = require('./gen3info.js')

router.get('/', (req, res) => {
    res.json(gen3info)
})

module.exports = router;