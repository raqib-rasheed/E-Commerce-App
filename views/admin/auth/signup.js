const layout = require('../layout');

module.exports = ({ req })=>{
    return  layout({
        content:
        `<div>
                Your id is: ${req.session.userId}
            <form method="POST">
                <input name="name" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirm">
                <button>Sign Up</button>
            </form>
        </div>`
    });
};