pub mod admin;
pub mod public;
pub mod auth;

use axum::Router;
use sqlx::PgPool;

pub fn app_routes(db_pool: PgPool) -> Router {
    Router::new()
        .nest("/admin", admin::admin_routes(db_pool.clone()))
        .nest("/public", public::public_routes(db_pool.clone()))
}
