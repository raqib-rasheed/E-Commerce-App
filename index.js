const express = require('express');

const app = express();
//here app is a massive object...,expecting a desteructring within {app}


app.get('/',(req,res) =>{
    res.send(`
    <div>
        <form>
            <input placeholder="email">
            <input placeholder="email">
            <input placeholder="email">
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.listen(3000,()=>{
    console.log("listening");
});