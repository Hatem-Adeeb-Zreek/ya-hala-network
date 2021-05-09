//The bcryptjs module provides methods for generating a salt,
//hashing with a salt, and comparing a hash to a plain text password.
const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

//The compare method will give us back a boolean if no error occurs.
// If the boolean is true, the password matches the hash. If it is false, the password is wrong.
module.exports.compare = compare;
module.exports.hash = (plainTxtPw) =>
    genSalt().then((salt) => hash(plainTxtPw, salt));
