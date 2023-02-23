const Order = require('../model/Order');
const User = require('../model/user');
const Product = require('../model/product');

module.exports.createOrder = async (req,res,next) => {
    const userId = req.userId;
    const {address,city,country,phone,postal_code} = req.body;
    try{
        const user = await User.findById(userId).populate('cart.productId');
        let products =[];
        let totalPrice = 0;
        for (const cp of user.cart) {
            const product = await Product.findById(cp.productId);
            totalPrice += +product.price * +cp.qty;
            products.push({title:product.title , image:product.image , qty:cp.qty , price:product.price , size:cp.size , color:cp.color});
        } 
        const order = new Order({
            address:address , city:city , country:country , phone:phone , postalCode:postal_code,
            products:products , totalPrice:totalPrice+5 , userId:userId , isDelivey:false
        });
        user.cart =[];
        await order.save();
        await user.save();
        res.status(200).json({message:"order has been created success"});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}


module.exports.getAllOrders = async (req,res,next) => {
    const last  = req.query.last || false;
    try{
        const orders = 
        last
        ?
        await Order.find().sort({"createdAt":"-1"}).limit(5).populate('userId')
        :
        await Order.find().sort({"createdAt":"-1"}).populate('userId');
        res.status(200).json({orders});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}

module.exports.getSingleOrder = async (req,res,next) => {
    const {orderId} = req.params;
    try{
        const order = await Order.findById(orderId).populate('userId');
        res.status(200).json({order});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}

module.exports.deiverOrder = async (req,res,next) => {
    const {orderId} = req.params;
    try{
        const order = await Order.findById(orderId);
        order.isDelivey = true;
        await order.save();
        res.status(200).json({message:"order has been deivery"});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}

module.exports.getUserOrders = async (req,res,next) => {
    const userId = req.userId;
    try{
        const orders = await Order.find({userId:userId})
        res.status(200).json({orders});
    }
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode = 500
        }
        next(err)
    }
}