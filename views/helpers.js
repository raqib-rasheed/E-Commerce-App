module.exports = {
    getError(errors,prop){
        try{
            return console.errors.mapped()[prop].msg;
        }catch (error){
            return '';
        }
    }
};