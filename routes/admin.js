const express = require('express')
const router = express.Router()
const departmentCont = require('../controller/department');
const categoryCont = require('../controller/category');
const productCont = require('../controller/product');
const orderCont = require('../controller/order')
const userCont = require('../controller/user');
const isAuth = require('../middleware/adminAuth');


const Order = require('../model/Order');
const User = require('../model/user');
const Product = require('../model/product');



router.post('/department/create', isAuth ,departmentCont.createDepartment);

router.get("/department" , isAuth , departmentCont.getDepartment);
router.get('/department/calc' , isAuth ,departmentCont.getNumberOfCategoryForEcahDepartment)

router.post('/category/create', isAuth ,categoryCont.createCategory);
router.get('/category', isAuth ,categoryCont.getCategory);

router.post('/product/create' , isAuth , productCont.createProduct);
router.get('/product/all' , isAuth , productCont.getProducts);
router.get('/product/:productId' , isAuth , productCont.getProductById);
router.put('/product/:productId' , isAuth , productCont.updateProduct);
router.delete('/product/:productId' , isAuth , productCont.deleteProduct);

router.get('/order/all' , isAuth , orderCont.getAllOrders);
router.get('/order/:orderId' , isAuth , orderCont.getSingleOrder);
router.put('/order/deliver/:orderId' , isAuth , orderCont.deiverOrder);

router.get('/users/all' , isAuth , userCont.getLastAlllUsers);


router.get('/count/information' , isAuth , async(req,res,next)=>{
    try{
        const users = await User.find().count();
        const products = await Product.find().count();
        const orders = await Order.find().count();
        res.status(200).json({users,products,orders});
    }
    catch(err){
        if(! err.statusCode){
            err.statusCode=500;
        }
        next(err);
    }
})

module.exports = router