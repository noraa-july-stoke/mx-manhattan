use axum::{
    extract::{Extension, State},
    http::{
        header::{self, HeaderMap, HeaderName},
        StatusCode, Uri,
    },
    response::{Html, IntoResponse},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use crate::db_types::{Fan, Release};

pub fn public_routes() -> Router {
    Router::new()
        .route("/fans", post(add_fan))
}

async fn add_fan(
    Extension(db_pool): Extension<PgPool>, // Change from State to Extension
    Json(payload): Json<Fan>,
) -> Result<Json<Fan>, (StatusCode, String)> {
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

pub fn admin_routes(db_pool: PgPool) -> Router {
    Router::new()
        .route("/admin/releases", get(get_releases).post(add_release))
        .layer(Extension(db_pool)) // Make sure the Extension middleware is applied
}

async fn get_releases(
    Extension(db_pool): Extension<PgPool>, // Change from State to Extension
) -> Result<Json<Vec<Release>>, StatusCode> {
    let releases = sqlx::query_as!(
        Release,
        "SELECT id, name, release_date FROM releases"
    )
    .fetch_all(&db_pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(releases))
}

async fn add_release(
    Extension(db_pool): Extension<PgPool>, // Change from State to Extension
    Json(payload): Json<Release>,
) -> Result<Json<Release>, (StatusCode, String)> {
    let result = sqlx::query_as!(
        Release,
        "INSERT INTO releases (name, release_date) VALUES ($1, $2) RETURNING id, name, release_date",
        payload.name,
        payload.release_date
    )
    .fetch_one(&db_pool)
    .await;

    match result {
        Ok(release) => Ok(Json(release)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}
