-- Add migration script here
-- Updated migration script with created_at and updated_at
CREATE TABLE releases (
    id SERIAL PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    artwork VARCHAR(255) NOT NULL,
    spotify_url VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(255) NOT NULL,
    apple_music_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
