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
    return db.query(
        `
        SELECT first, last, avatar, bio
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
        SET avatar = $1
        WHERE id = $2
        RETURNING avatar;       
        `,
        [profilePicUrl, userId]
    );
};

// Update Bio
exports.updateBio = (bioText, userId) => {
    return db.query(
        `
        UPDATE users
        SET bio = $1
        WHERE id = $2
        RETURNING bio;
        `,
        [bioText, userId]
    );
};

// get three most recent users
exports.getMostRecent = () => {
    return db.query(
        `
        SELECT id, first, last, avatar 
        FROM users 
        ORDER BY id DESC 
        LIMIT 3;
        `
    );
};

// search for specific users
exports.searchUser = (search) => {
    return db.query(
        `
        SELECT id, first, last, avatar 
        FROM users 
        WHERE first ILIKE $1 
        OR last ILIKE $1
        ORDER BY first ASC 
        LIMIT 15;
        `,
        ["%" + search + "%"]
    );
};

// get the status of the friendship btw users
exports.getFriendshipStatus = (userId, otherId) => {
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1);
        `,
        [userId, otherId]
    );
};

// delete friendship
exports.deleteFriendship = (userId, otherId) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1);
        `,
        [userId, otherId]
    );
};

// accept friendship
exports.acceptFriendship = (userId, otherId) => {
    return db.query(
        `
        UPDATE friendships
        SET accepted = true
        WHERE (sender_id = $2 AND recipient_id = $1); 
        `,
        [userId, otherId]
    );
};

// send friendship
exports.sendFriendship = (userId, otherId) => {
    return db.query(
        `
        INSERT INTO friendships
        (sender_id, recipient_id)
        VALUES ($1, $2);
        `,
        [userId, otherId]
    );
};

// get who is a friend and who is want to be a friend
exports.getFriendsAndWannabes = (userId) => {
    return db.query(
        `
        SELECT users.id, first, last, avatar, accepted, sender_id
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = false AND sender_id = $1 AND recipient_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id);
        `,
        [userId]
    );
};

// get the history of the messages
exports.getMsgBrdHistory = () => {
    return db.query(
        `
        SELECT msgboard.id, message, first, last, avatar, msgboard.created_at
        FROM msgboard
        JOIN users
        ON author = users.id
        ORDER BY msgboard.created_at DESC
        LIMIT 10;
        `
    );
};

// add messages to the board
exports.addBoardMessage = (userId, msg) => {
    return db.query(
        `
        INSERT INTO msgboard
        (author, message)
        VALUES ($1, $2);
        `,
        [userId, msg]
    );
};

// online users feature
module.exports.getUsersByIds = (arr) => {
    return db.query(
        `SELECT id, first, last, avatar 
        FROM users WHERE id = ANY($1)`,
        [arr]
    );
};
