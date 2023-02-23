const express = require('express')
const router = express.Router()
const productCont = require('../controller/product');


router.get('/department/:departmentId/products'  , productCont.getProductsByDepartment)

module.exports = router