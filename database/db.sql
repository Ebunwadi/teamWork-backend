CREATE DATABASE teamwork;

CREATE TABLE users (
    id serial PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    email VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    gender VARCHAR (50) NOT NULL,
    job_role VARCHAR (50) NOT NULL,
    department VARCHAR (50) NOT NULL,
    address VARCHAR (50) NOT NULL,
    is_admin BOOLEAN
);

CREATE TABLE gifs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    is_flagged BOOLEAN DEFAULT false,
    user_id serial NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES users (id)
);

CREATE TABLE gif_comment (
    id SERIAL PRIMARY KEY,
    comments VARCHAR NOT NULL,        
    created_at timestamp with time zone NOT NULL,
    gif_id INTEGER NOT NULL,
    is_flagged BOOLEAN DEFAULT false,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) 
    REFERENCES users (id)
);


