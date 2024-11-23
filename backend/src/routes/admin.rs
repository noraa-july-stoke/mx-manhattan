// admin.rs
use crate::{
    db_types::{AboutContent, Release},
    routes::auth::{login_user, verify_jwt, LoginRequest},
};
use axum::{
    async_trait,
    body::Body,
    extract::{Extension, FromRequest, Path},
    http::{HeaderMap, Request, StatusCode},
    response::IntoResponse,
    routing::{delete, post, put},
    Json, Router,
};
use serde_json::json;
use sqlx::PgPool;

pub fn admin_routes(db_pool: PgPool) -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/releases", post(add_release)) // Adding a new release
        .route("/releases/:id", put(edit_release)) // Edit a release by ID
        .route("/releases/:id", delete(delete_release)) // Delete a release by ID
        .route("/about", post(update_about))
        .layer(Extension(db_pool))
}

struct AuthenticatedUser {
    email: String,
}

#[async_trait]
impl<S> FromRequest<S> for AuthenticatedUser
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request(req: Request<Body>, _state: &S) -> Result<Self, Self::Rejection> {
        let headers: &HeaderMap = req.headers();
        let auth_header = headers
            .get("Authorization")
            .ok_or(StatusCode::UNAUTHORIZED)?;

        let token = auth_header.to_str().map_err(|_| StatusCode::UNAUTHORIZED)?;
        let token_data = verify_jwt(token).map_err(|_| StatusCode::UNAUTHORIZED)?;

        Ok(AuthenticatedUser {
            email: token_data.claims.sub,
        })
    }
}

// ==============================
// AUTH
// ==============================
async fn login(
    Extension(db_pool): Extension<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    println!("Logging in");
    match login_user(Extension(db_pool), Json(payload)).await {
        Ok(token) => {
            let response_body = json!({ "token": token });
            (StatusCode::OK, Json(response_body)).into_response()
        }
        Err(status) => status.into_response(),
    }
}
// ==============================
// RELEASES
// ==============================

async fn add_release(
    Extension(db_pool): Extension<PgPool>,
    Json(payload): Json<Release>,
) -> Result<Json<Release>, (StatusCode, String)> {
    let result = sqlx::query_as!(
        Release,
        r#"
        INSERT INTO releases (name, release_date, artwork, spotify_url, youtube_url, apple_music_url, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, name, release_date, artwork, spotify_url, youtube_url, apple_music_url, created_at, updated_at
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

async fn edit_release(
    Extension(db_pool): Extension<PgPool>,
    Path(id): Path<i32>,
    Json(payload): Json<Release>,
) -> Result<Json<Release>, (StatusCode, String)> {
    let result = sqlx::query_as!(
        Release,
        r#"
        UPDATE releases
        SET name = $1,
            release_date = $2,
            artwork = $3,
            spotify_url = $4,
            youtube_url = $5,
            apple_music_url = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING id, name, release_date, artwork, spotify_url, youtube_url, apple_music_url, created_at, updated_at
        "#,
        payload.name,
        payload.release_date,
        payload.artwork,
        payload.spotify_url,
        payload.youtube_url,
        payload.apple_music_url,
        id
    )
    .fetch_one(&db_pool)
    .await;

    match result {
        Ok(updated_release) => Ok(Json(updated_release)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

async fn delete_release(
    Extension(db_pool): Extension<PgPool>,
    Path(id): Path<i32>,
) -> Result<StatusCode, (StatusCode, String)> {
    let result = sqlx::query!("DELETE FROM releases WHERE id = $1", id)
        .execute(&db_pool)
        .await;

    match result {
        Ok(_) => Ok(StatusCode::NO_CONTENT), // Successfully deleted
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

// ==============================
// MISC
// ==============================

async fn update_about(
    Extension(db_pool): Extension<PgPool>,
    Json(updated_content): Json<AboutContent>,
) -> Result<impl IntoResponse, StatusCode> {
    println!("updating about section");
    println!("{:?}", updated_content);

    let result = sqlx::query!(
        "INSERT INTO about (id, bio, contact_email, designer, portfolio_link)
        VALUES (1, $1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE
        SET bio = EXCLUDED.bio,
            contact_email = EXCLUDED.contact_email,
            designer = EXCLUDED.designer,
            portfolio_link = EXCLUDED.portfolio_link",
        updated_content.bio,
        updated_content.contact_email,
        updated_content.designer,
        updated_content.portfolio_link
    )
    .execute(&db_pool)
    .await;

    match result {
        Ok(res) => {
            println!("Rows affected: {}", res.rows_affected());
            Ok((StatusCode::OK, "Updated successfully"))
        }
        Err(err) => {
            println!("Error updating: {:?}", err);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
