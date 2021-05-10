// DATABASE Config
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:123456789@localhost:5432/socialnetwork"
);

// GET User Data By Email
exports.getUserDataByEmail = (inputEmail) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [inputEmail]);
};

// Create User
exports.createUser = (firstname, lastname, email, hashedPw) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [firstname, lastname, email, hashedPw]
    );
};

// Store Code
exports.storeCode = (secretCode, userEmail) => {
    return db.query(
        `
        INSERT INTO reset_codes (code, email)
        VALUES ($1, $2)        
        `,
        [secretCode, userEmail]
    );
};
