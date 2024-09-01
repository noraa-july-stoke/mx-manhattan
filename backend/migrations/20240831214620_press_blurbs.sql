-- Add migration script here
CREATE TABLE press_blurbs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    link VARCHAR NOT NULL,
    video VARCHAR
)
