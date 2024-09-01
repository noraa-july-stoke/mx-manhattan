use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Fan {
    pub id: i32,
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct Release {
    pub id: i32,
    pub name: String,
    pub release_date: NaiveDate,
    pub artwork: String,
    pub spotify_url: String,
    pub youtube_url: String,
    pub apple_music_url: String,
}

#[derive(Serialize, Deserialize)]
pub struct PressBlurb {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub link: String,
    pub video: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Show {
    pub id: i32,
    pub show_date: NaiveDate,
    pub venue: String,
    pub ticketing_link: Option<String>,
    pub artwork: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Video {
    pub id: i32,
    pub title: String,
    pub url: String,
}

#[derive(Serialize, Deserialize)]
pub struct Blog {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub post_date: NaiveDate,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub password_hash: String,
}
