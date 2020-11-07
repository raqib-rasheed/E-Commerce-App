const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const script = util.promisify(crypto.script);

class UsersRepository {
    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename');
        }

        this.filename = filename;
        try{
            fs.accessSync(this.filename);
        }catch(err){
            fs.writeFileSync(this.filename,'[]');
        }
    }

    async getAll(){
         return JSON.parse(
            await fs.promises.readFile(this.filename,{
                encoding:'utf8' 
            })
        );
    }

    async comparePasswords(saved,supplied){
        //saved  -> password which is saved in database. eg: "hashed.salt"
        //supplied -> password which given to us by trying to sign in.        
        const result = saved.split('.');
        const hashed =result[0];
        const salt = result[1];
        //can be also wwritten as with short hand method
                 //const [hashed,salt] = saved.split(".");
        const hashedSuppliedbuf = await script(supplied,salt,64);

        return hashed === hashedSuppliedbuf;

    }
    async create(attrs){      //attrs= { email:'' , password:''}
        attrs.id = this.randomId();     //to add an id to all the attributes
        
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer =await scrypt(attrs.password,salt,64);
        
        const records = await this.getAll();        //to add a new user
        const record = {
            ...attrs,
            password:`${buffer.toString('hex')}.${salt}`
            }
        records.push(record);       //write the updated 'records' array  back to this.filename;
        await this.writeAll(records);

        return   record; 
    }
    async writeAll(records){
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(records,null,2)
            );
    }
    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }
    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
    async delete(id){
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }
    async update(id,attrs){
        const records = await this.getAll();
        const record = records.find(record => record.id ===id);

        if(!record){
            throw new Error(`Record with id ${id} not found`)
        }
        Object.assign(record,attrs);
        await this.writeAll(records);
    }
    async getOneBy(filters){
        const records = await this.getAll();

        for(let record of records){
            let found = true;

            for(let key in filters){
                if(record[key] !== filters[key]){
                    found=false;
                }
            }
            
            if(found){
                return record;
            }
        }
    }
}

module.exports =new UsersRepository('users.json');

