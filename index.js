const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/user');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
//here app is a massive object...,
app.get('/',(req,res) =>{
    res.send(`
    <div>
        <form method="POST">
            <input name="name" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passwordConfirmation" placeholder="password confirm">
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post("/",async (req,res) => {
//get access to email,password,password Confirmation.
//req.body is an object contaning the entered pass ema.... by the user
const { email, password,passwordConfirmation} = req.body;
const existingUser = await usersRepo.getOneBy({ email });
    if(existingUser){
    return res.send('Email already in use');
}
    if(password!==passwordConfirmation){
        return res.send('passwords must match');
    }
    res.send('account created');
});

app.listen(3001,()=>{
    console.log("listening");
});
