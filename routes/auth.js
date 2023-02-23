const express = require('express')
const router = express.Router()
const authCont = require('../controller/auth')

router.post('/admin/register',authCont.registerAdmin)
router.post('/admin/login',authCont.loginAdmin)

module.exports = router