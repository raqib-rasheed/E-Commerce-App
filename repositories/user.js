const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository{
    async create(attrs){     //attrs= { email:'' , password:''}
    try {
        attrs.id = this.randomId();     //to add an id to all the attributes
        
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer =await scrypt(attrs.password,salt,64);
        
        const records = await this.getAll();        //to add a new user
        const record = {
            ...attrs,
            password:`${buffer.toString('hex')}.${salt}`
            }
            console.log(record);
        records.push(record);       //write the updated 'records' array  back to this.filename;
        await this.writeAll(records);
    
        return   record; 
    } catch (error) {
        console.log(error);
    }
    
    
    }
async comparePasswords(saved,supplied){
    //saved  -> password which is saved in database. eg: "hashed.salt"
    //supplied -> password which given to us by trying to sign in.        
    const result = saved.split('.');
    const hashed =result[0];
    const salt = result[1];
    //can be also wwritten as with short hand method
             //const [hashed,salt] = saved.split(".");
    const hashedSuppliedbuf = await scrypt(supplied,salt,64);

    return hashed === hashedSuppliedbuf;

    }
}

module.exports =new UsersRepository('users.json');

