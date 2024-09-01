// src/init.rs
use argon2::{
    password_hash::{PasswordHash, PasswordHasher, SaltString},
    Argon2,
};use sqlx::PgPool;
use std::env;

pub async fn create_initial_admin_user(db_pool: &PgPool) -> Result<(), sqlx::Error> {
    let admin_exists = sqlx::query!(
        "SELECT 1 AS exists FROM users WHERE email = $1",
        env::var("INITIAL_ADMIN_EMAIL").unwrap()
    )
    .fetch_optional(db_pool)
    .await?;

    if admin_exists.is_none() {
        let hashed_password = hash_password(env::var("INITIAL_ADMIN_PASSWORD").unwrap()).await;
        sqlx::query!(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
            env::var("INITIAL_ADMIN_EMAIL").unwrap(),
            hashed_password
        )
        .execute(db_pool)
        .await?;
    }

    Ok(())
}

pub async fn hash_password(password: String) -> String {
    let argon2 = Argon2::default();
    let salt = SaltString::generate(&mut rand::thread_rng());
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .expect("Error hashing password");
    password_hash.to_string()
}
