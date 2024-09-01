use axum::{Router};
use sqlx::PgPool;
use crate::routes;

pub fn create_app(db_pool: PgPool) -> Router {
    Router::new()
        .merge(routes::public::public_routes(db_pool.clone()))
        .merge(routes::admin::admin_routes(db_pool.clone()))
}
