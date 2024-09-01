use crate::db_types::Release;
use axum::{
    extract::Extension,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use sqlx::PgPool;

pub fn admin_routes(db_pool: PgPool) -> Router {
    Router::new()
        .route("/releases", post(add_release))
        // Additional routes can go here...
        .layer(Extension(db_pool)) // Ensure Extension middleware is applied
}

async fn get_releases(
    Extension(db_pool): Extension<PgPool>,
) -> Result<Json<Vec<Release>>, StatusCode> {
    let releases = sqlx::query_as!(
        Release,
        r#"
        SELECT
            id,
            name,
            release_date,
            artwork,
            spotify_url,
            youtube_url,
            apple_music_url
        FROM releases
        "#
    )
    .fetch_all(&db_pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(releases))
}

async fn add_release(
    Extension(db_pool): Extension<PgPool>,
    Json(payload): Json<Release>,
) -> Result<Json<Release>, (StatusCode, String)> {
    let result = sqlx::query_as!(
        Release,
        r#"
        INSERT INTO releases (name, release_date, artwork, spotify_url, youtube_url, apple_music_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, release_date, artwork, spotify_url, youtube_url, apple_music_url
        "#,
        payload.name,
        payload.release_date,
        payload.artwork,
        payload.spotify_url,
        payload.youtube_url,
        payload.apple_music_url
    )
    .fetch_one(&db_pool)
    .await;

    match result {
        Ok(release) => Ok(Json(release)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}
