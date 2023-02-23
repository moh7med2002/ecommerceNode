const express = require('express')
const router = express.Router()
const userCont = require('../controller/user');
const departmentCont = require('../controller/department');
const productCont = require('../controller/product');
const orderCont = require('../controller/order')

const isUserAuth = require('../middleware/userAuth');

// departmet function
router.get('/department' , departmentCont.getDepartment);

// product function
router.get('/last_products' , productCont.getLastProducts);
router.get('/products/:productId'  , productCont.getProductById);

router.post('/auth/register' , userCont.register)
router.post('/auth/login' , userCont.login)
router.put('/product/favirote/:productId' , isUserAuth ,  userCont.faviroteProduct);
router.put('/product/cart/:productId' , isUserAuth ,  userCont.addProductToCart);
router.put('/product/review/:productId' , isUserAuth , productCont.reviewProduct);
router.delete('/product/cart/:cardItemId' , isUserAuth ,  userCont.deleteProductFromCart);

// order
router.put('/order/create' , isUserAuth , orderCont.createOrder);
router.get('/my_orders/all' , isUserAuth , orderCont.getUserOrders);
router.get('/order/:orderId' , isUserAuth , orderCont.getSingleOrder);



router.get('/:userId' , isUserAuth , userCont.getSingleUser);


module.exports = router