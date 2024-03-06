const express = require('express')
const router = express.Router()
const gen8info = require('./gen8info.js')

router.get('/', (req, res) => {
    res.json(gen8info)
})

module.exports = router;