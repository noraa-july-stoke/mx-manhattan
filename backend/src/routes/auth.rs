use axum::{
    extract::{Extension, Form},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::env;
use crate::init::hash_password;


#[derive(Deserialize)]
pub struct RegisterUser {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct UserResponse {
    pub email: String,
}

// Handle user registration
pub async fn register_user(
    Extension(db_pool): Extension<PgPool>,
    Form(payload): Form<RegisterUser>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // Check if user already exists
    let user_exists = sqlx::query!("SELECT 1 AS exists FROM users WHERE email = $1", payload.email)
        .fetch_optional(&db_pool)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Database query error".to_string()))?;

    if user_exists.is_some() {
        return Err((StatusCode::CONFLICT, "User already exists".to_string()));
    }

    // Hash the password
    let hashed_password = hash_password(payload.password).await;

    // Insert new user
    sqlx::query!(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
        payload.email,
        hashed_password
    )
    .execute(&db_pool)
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Database insertion error".to_string()))?;

    Ok(Json(UserResponse {
        email: payload.email,
    }))
}

// Handle user login
pub async fn login_user(
    Extension(db_pool): Extension<PgPool>,
    Form(payload): Form<LoginUser>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // Fetch user from database
    let row = sqlx::query!("SELECT password_hash FROM users WHERE email = $1", payload.email)
        .fetch_one(&db_pool)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Database query error".to_string()))?;

    // Verify password
    let parsed_hash = PasswordHash::new(&row.password_hash).map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid password".to_string()))?;
    if !Argon2::default().verify_password(payload.password.as_bytes(), &parsed_hash).is_ok() {
        return Err((StatusCode::UNAUTHORIZED, "Invalid password".to_string()));
    }

    // Here you would generate and return a token if using JWT or similar

    Ok(StatusCode::OK.into_response())
}
