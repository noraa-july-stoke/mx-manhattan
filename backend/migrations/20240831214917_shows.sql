-- Add migration script here
CREATE TABLE shows (
    id SERIAL PRIMARY KEY,
    show_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticketing_link VARCHAR,
    artwork VARCHAR
)
