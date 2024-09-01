-- Add migration script here
CREATE TABLE releases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    artwork VARCHAR(255) NOT NULL,
    spotify_url VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(255) NOT NULL,
    apple_music_url VARCHAR(255) NOT NULL
);
