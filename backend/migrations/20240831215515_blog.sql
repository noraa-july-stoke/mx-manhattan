-- Add migration script here
CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_date DATE NOT NULL
)
