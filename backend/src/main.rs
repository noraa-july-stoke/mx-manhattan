use crate::init::create_initial_admin_user;
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;

mod app;
mod db_types;
mod init;
mod routes;

#[tokio::main]
async fn main() {
    dotenv().expect("Unable to access .env file");
    let server_address = std::env::var("SERVER_ADDRESS").unwrap_or("localhost:8080".to_owned());
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL not found in env file");
    let admin_email = std::env::var("INITIAL_ADMIN_EMAIL").expect("INITIAL_ADMIN_EMAIL not set");
    let admin_password =
        std::env::var("INITIAL_ADMIN_PASSWORD").expect("INITIAL_ADMIN_PASSWORD not set");

    let db_pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&database_url)
        .await
        .expect("Can't connect to database");

    if let Err(e) = create_initial_admin_user(&db_pool).await {
        eprintln!("Failed to create initial admin user: {:?}", e);
        return;
    }

    let listener = TcpListener::bind(server_address)
        .await
        .expect("Could not create TCP listener");

    println!("Listening on {}", listener.local_addr().unwrap());

    let app = app::create_app(db_pool);

    axum::serve(listener, app)
        .await
        .expect("Error serving application");
}
