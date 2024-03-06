const express = require('express')
const router = express.Router()
const gen6info = require('./gen6info.js')

router.get('/', (req, res) => {
    res.json(gen6info)
})

module.exports = router;