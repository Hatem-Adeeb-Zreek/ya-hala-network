// DATABASE Config
const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:123456789@localhost:5432/socialnetwork"
);

// GET User Data By Email
exports.getUserDataByEmail = (userEmail) => {
    return db.query(
        `
        SELECT * 
        FROM users 
        WHERE email = $1;
        `,
        [userEmail]
    );
};

// GET User Data By Id
exports.getUserDataById = (userId) => {
    // need bio after ppicurl
    return db.query(
        `
        SELECT first, last, p_pic_url
        FROM users 
        WHERE id = $1;
        `,
        [userId]
    );
};

// Check Code
exports.checkCode = (userEmail) => {
    return db.query(
        `
        SELECT code FROM reset_codes
        WHERE email = $1
        AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
        ORDER BY timestamp DESC
        LIMIT 1;
        `,
        [userEmail]
    );
};

// Create User
exports.createUser = (firstname, lastname, email, hashedPw) => {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
        [firstname, lastname, email, hashedPw]
    );
};

// Store Code
exports.storeCode = (secretCode, userEmail) => {
    return db.query(
        `
        INSERT INTO reset_codes (code, email)
        VALUES ($1, $2);       
        `,
        [secretCode, userEmail]
    );
};

// Update Password
exports.updatePw = (hashedPw, userEmail) => {
    return db.query(
        `
        UPDATE users
        SET password = $1
        WHERE email = $2;
        `,
        [hashedPw, userEmail]
    );
};

// Upload Picture
exports.uploadPicture = (profilePicUrl, userId) => {
    return db.query(
        `
        UPDATE users
        SET p_pic_url = $1
        WHERE id = $2
        RETURNING p_pic_url;       
        `,
        [profilePicUrl, userId]
    );
};
