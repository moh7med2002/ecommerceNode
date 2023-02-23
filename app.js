const express = require('express')
const app = express()
const parser = require('body-parser')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')

app.use(parser.json())
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'images');
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+"-" + file.originalname)
    }
})

app.use(multer({storage:fileStorage}).single('image'));
app.use('/images', express.static(path.join(__dirname,'images')));

app.use((req,res,next)=>
{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,PATCH,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization')
    if(req.method==="OPTIONS")
    {
        return res.sendStatus(200)
    }
    next();
})

const product = require('./routes/product')
app.use(product)

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const department = require('./routes/department')
app.use('/api/department',department)

const productRouter = require('./routes/product')
app.use('/api/product',productRouter)

const adminRouter = require('./routes/admin');
app.use('/api/admin' , adminRouter);

const userRouter = require('./routes/user');
app.use('/api/user' , userRouter);

app.use((error,req,res,next)=>
{
    console.log(error);
    const status = error.statusCode
    const message = error.message
    res.status(status).json({message:message})
})

mongoose.connect('mongodb+srv://mohamed:059283805928388@cluster0.aueco.mongodb.net/shop?retryWrites=true&w=majority')
.then((result)=>{
    console.log("server connect");
    app.listen(process.env.PORT || 8000);
    })
.catch(err=>{
    console.log(err);
});