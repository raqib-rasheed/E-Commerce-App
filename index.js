const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');   

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
//here app is a massive object...,
app.use(cookieSession({
    keys:['askfjafavasaf']
}));

app.use(authRouter); 

app.listen(3001,()=>{
    console.log("listening");
});
