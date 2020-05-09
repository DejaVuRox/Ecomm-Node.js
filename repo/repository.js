const fs = require('fs')
const crypto = require('crypto')

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a new repository requires a filename");
    }
    this.filename = filename;
    //not really recommended in real production because we only call it once for the entire lifecycle of the application
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  //CREATES
  async create(attrs) {
    attrs.id = this.randomId()

    const records = await this.getAll()
    records.push(attrs)
    await this.writeAll(records)

    return attrs
  }

  // GET ALL METHOD
  async getAll() {
    // Open the file called this.filename
    // Read its contents
    // Parse the contents to an object
    // Return the parsed data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async writeAll(records) {
    // Write the updated 'records' array back to this.filename
    // Parse back to a string
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
  /////////////////////////////////////////////////////

  //GETTTING ONE BY USING HE'S ID
  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  //DELETING 
  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  //UPDATING 
  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  //FINDING WHAT MATCHES THE FILTERS
  async getOneBy(filters) {
    const records = await this.getAll();
    //for of = array
    for (let record of records) {
      let found = true;
      //for in = object
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
};
