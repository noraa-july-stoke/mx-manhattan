use axum::{extract::Extension, http::StatusCode, routing::{get, post}, Json, Router};
use sqlx::PgPool;
use crate::db_types::{Release, PressBlurb, Show, Video, Blog, Fan};

pub fn public_routes(db_pool: PgPool) -> Router {
    Router::new()
        .route("/releases", get(get_releases))
        .route("/press", get(get_press))
        .route("/shows", get(get_shows))
        .route("/videos", get(get_videos))
        .route("/blog", get(get_blog_posts))
        .route("/fans", post(add_fan))
        .layer(Extension(db_pool))
}

async fn get_releases(Extension(db_pool): Extension<PgPool>) -> Result<Json<Vec<Release>>, StatusCode> {
    let releases = sqlx::query_as!(Release, "SELECT * FROM releases")
        .fetch_all(&db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(releases))
}

async fn get_press(Extension(db_pool): Extension<PgPool>) -> Result<Json<Vec<PressBlurb>>, StatusCode> {
    let press = sqlx::query_as!(PressBlurb, "SELECT * FROM press_blurbs")
        .fetch_all(&db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(press))
}

async fn get_shows(Extension(db_pool): Extension<PgPool>) -> Result<Json<Vec<Show>>, StatusCode> {
    let shows = sqlx::query_as!(Show, "SELECT * FROM shows")
        .fetch_all(&db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(shows))
}

async fn get_videos(Extension(db_pool): Extension<PgPool>) -> Result<Json<Vec<Video>>, StatusCode> {
    let videos = sqlx::query_as!(Video, "SELECT * FROM videos")
        .fetch_all(&db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(videos))
}

async fn get_blog_posts(Extension(db_pool): Extension<PgPool>) -> Result<Json<Vec<Blog>>, StatusCode> {
    let blogs = sqlx::query_as!(Blog, "SELECT * FROM blog")
        .fetch_all(&db_pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(blogs))
}

async fn add_fan(Extension(db_pool): Extension<PgPool>, Json(payload): Json<Fan>) -> Result<Json<Fan>, (StatusCode, String)> {
    let result = sqlx::query_as!(
        Fan,
        "INSERT INTO fans (email) VALUES ($1) RETURNING id, email",
        payload.email
    )
    .fetch_one(&db_pool)
    .await;

    match result {
        Ok(fan) => Ok(Json(fan)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}
