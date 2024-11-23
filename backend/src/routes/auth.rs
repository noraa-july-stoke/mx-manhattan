// auth.rs
use crate::init::hash_password;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use axum::{
    extract::{Extension, Form},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::env;

#[derive(Deserialize)]
pub struct RegisterUser {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    exp: usize,
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

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

// Handle user registration
pub async fn register_user(
    Extension(db_pool): Extension<PgPool>,
    Form(payload): Form<RegisterUser>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    // Check if user already exists
    let user_exists = sqlx::query!(
        "SELECT 1 AS exists FROM users WHERE email = $1",
        payload.email
    )
    .fetch_optional(&db_pool)
    .await
    .map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Database query error".to_string(),
        )
    })?;

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
    .map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Database insertion error".to_string(),
        )
    })?;

    Ok(Json(UserResponse {
        email: payload.email,
    }))
}

pub async fn login_user(
    Extension(db_pool): Extension<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<String, StatusCode> {
    let user = sqlx::query!(
        "SELECT email, password_hash FROM users WHERE email = $1",
        payload.email
    )
    .fetch_one(&db_pool)
    .await
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if verify_password(payload.password, user.password_hash) {
        let token = generate_jwt(&user.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        println!("Login Successful");
        Ok(token)
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
}

fn verify_password(password: String, hash: String) -> bool {
    let argon2 = Argon2::default();
    let parsed_hash = PasswordHash::new(&hash).expect("Invalid hash");
    argon2
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok()
}

pub fn generate_jwt(email: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let expiration = 3600; // 1 hour
    let claims = Claims {
        sub: email.to_owned(),
        exp: (chrono::Utc::now().timestamp() + expiration) as usize,
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
}

pub fn verify_jwt(token: &str) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
}
