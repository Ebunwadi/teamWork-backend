CREATE DATABASE teamwork;

CREATE TABLE users (
    userId serial PRIMARY KEY,
    firstName VARCHAR (50) NOT NULL,
    lastName VARCHAR (50) NOT NULL,
    email VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    gender VARCHAR (50) NOT NULL,
    jobRole VARCHAR (50) NOT NULL,
    department VARCHAR (50) NOT NULL,
    address VARCHAR (50) NOT NULL,
    isAdmin BOOLEAN
);