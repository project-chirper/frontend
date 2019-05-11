export default class Cache {
  constructor(ukey) {
    if (ukey === undefined) throw new Error("Unique Key required")

    this.ukey = ukey
    this.ukeySet = new Set()
    this.objects = []
  }

  validateObj(obj) {
    if (obj[this.ukey] === undefined) throw new Error("Object does not have unique key present")
    else if (typeof obj[this.ukey] === "object") throw new Error("Unique Key can not be an object")
    return true
  }

  findIndex(ukeyValue) {
    for(let i = 0; i < this.objects.length; i++) {
      if (this.objects[i][this.ukey] === ukeyValue) return i
    }
    return false
  }

  // Adds object to cache. Returns: true if successful, false if already exists
  add(obj) {
    this.validateObj(obj) // validate obj
    if (this.ukeySet.has(obj[this.ukey])) return false // return false if already present
    this.ukeySet.add(obj[this.ukey]) // add ukey to set
    this.objects.push(obj) // add obj to array
    return true
  }

  // Adds many objects at a time. Takes in an array. Returns true or throws error if any
  addMany(objArray) {
    for(let i = 0; i < objArray.length; i++) {
      this.add(objArray[i])
    }
    return true
  }

  // Removes object from cache. Returns: true if successful, false if doesn't exist
  remove(ukeyValue) {
    if (!this.ukeySet.has(ukeyValue)) return false // obj doesn't exist, return false
    this.ukeySet.delete(ukeyValue) // delete ukey from ukeySet
    this.objects.splice(this.findIndex(ukeyValue), 1) // delete from objects array
    return true
  }

  // Returns true if object exists, false otherwise
  has(ukeyValue) {
    return this.ukeySet.has(ukeyValue)
  }

  // Fetches object with ukeyValue. Returns: object if exists, false otherwise
  fetch(ukeyValue) {
    return this.has(ukeyValue) ? this.objects[this.findIndex(ukeyValue)] : false
  }
}