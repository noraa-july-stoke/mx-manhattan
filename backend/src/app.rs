use axum::Router;
use sqlx::PgPool;
use crate::routes;

pub fn create_app(db_pool: PgPool) -> Router {
    Router::new()
        .merge(routes::app_routes(db_pool))
}
