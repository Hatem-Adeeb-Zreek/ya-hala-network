-- Create a users table
--  bio         TEXT, after ppicurl
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL   PRIMARY KEY,
    first       VARCHAR(255) NOT NULL,
    last        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
     p_pic_url   VARCHAR(255),
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