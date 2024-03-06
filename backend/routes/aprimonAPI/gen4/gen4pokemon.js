const express = require('express')
const router = express.Router()
const gen4info = require('./gen4info.js')

router.get('/', (req, res) => {
    res.json(gen4info)
})

module.exports = router;