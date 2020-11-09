const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');   
const productsRouter = require('./routes/admin/products')

const app = express();

app.use(express.static('Public'));
app.use(bodyParser.urlencoded({extended:true}));
//here app is a massive object...,
app.use(cookieSession({
    keys:['askfjafavasaf']
}));

app.use(authRouter); 
app.use(productsRouter);
app.listen(3001,()=>{
    console.log("listening");
});
