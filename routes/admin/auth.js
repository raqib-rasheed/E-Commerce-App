const express = require('express');
const usersRepo = require('../../repositories/user');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin')

const router = express.Router();

router.get('/signup',(req,res) =>{
    res.send(signupTemplate({ req:req}));     
});

router.post('/signup',async (req,res) => {
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
    //create a user in the user repo to represent this person
    const user = await usersRepo.create({email:email,password:password});

    //store the id of that user inside the users cookie
    req.session.userId ===user.id; //added by the cookie session!

    res.send('account created');
});

router.get('/signout',(req,res) => {
  req.session = null;
  res.send('logged out');
});

router.get('/signin',(req,res) => {
res.send(signinTemplate());
});
router.post('/signin',async (req,res) => {
    const { email,password} = req.body;
    const user = await usersRepo.getOneBy({ email });
    if(!user){
        return res.send('Email not found');
    }
    const validPass = await usersRepo.comparePasswords(
        user.password,
        password
    );
    if (!validPass){
        return res.send('invalid password');
    }
     req.session.userId =user.id;

     res.send('You are signed in!!!!!!');
     
});

module.exports = router;