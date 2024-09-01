-- Add migration script here
CREATE TABLE fans (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
)
