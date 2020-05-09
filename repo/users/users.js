const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require('../repository')

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository {

  // CREATES A USER AND SAVES DATA TO JSON
  async create(attrs) {
    // attrs === { email: '', password: '' }

    // Gives a unique ID to each USER
    attrs.id = this.randomId();

    // Encrypting our password data base
    const salt = crypto.randomBytes(8).toString("hex");
    const hashed = await scrypt(attrs.password, salt, 64);

    // Get the most updated record of users
    const records = await this.getAll();
    const record = {
      ...attrs,
      password: `${hashed.toString("hex")}.${salt}`,
    };
    records.push(record);

    //Using the method writeAll() to write the new records
    await this.writeAll(records);

    //will return an object with the id and user password we create
    return record;
  }

  //COMPARING HASHED PASSWORDS
  async comparePassword(savedPass, suppliedPass) {
    // savedPass -> password saved in out database. 'hashed.salt'
    // suppliedPass -> password given to us by a user trying to sigh in.
    const [hashed, salt] = savedPass.split('.')
    const hashedSuppliedBuff = await scrypt(suppliedPass, salt, 64)

    return hashed === hashedSuppliedBuff.toString('hex')
  }
}

module.exports = new UserRepository("users.json");
