-- Create a users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL   PRIMARY KEY,
    first       VARCHAR(255) NOT NULL,
    last        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    avatar      VARCHAR(255),
    bio         TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ); 

-- Create a reset_codes table
DROP TABLE IF EXISTS reset_codes CASCADE;
CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ); 

-- create a friendships table
DROP TABLE IF EXISTS friendships CASCADE;
CREATE TABLE friendships(
    id          SERIAL PRIMARY KEY,
    sender_id   INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted    BOOLEAN DEFAULT false
    );

-- create a msgboard table
DROP TABLE IF EXISTS msgboard CASCADE;
CREATE TABLE msgboard(
    id          SERIAL PRIMARY KEY,
    message         TEXT,
    author      INT REFERENCES users(id) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ); 
    
    INSERT INTO msgboard
    (message, author, created_at)
VALUES 
    ('Hi Baby, How are you ???', 201, '2021-05-11 23:05:58'),

    ('Hi Love, I am fine and you ?? ', 64, '2021-05-11 23:05:59');
