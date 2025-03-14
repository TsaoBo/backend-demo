const express = require('express')
const { registerInit, verifyEmail } = require('../controllers/member')

const router = express.Router()

router.post('/register', registerInit)
router.post('/verify-email', verifyEmail)

module.exports = router