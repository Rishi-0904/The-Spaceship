"""Helper script to create database 'portfolio' if it does not exist."""
import asyncio
import os
import asyncpg

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/portfolio")

async def main():
    # Parse username, password, host, port from DATABASE_URL
    # Default fallback:
    # postgresql://postgres:postgres@localhost:5432/portfolio
    # We want to connect to 'postgres' database first to create 'portfolio'
    
    # Simple replacement: replace '/portfolio' at the end with '/postgres'
    base_url, db_name = DATABASE_URL.rsplit('/', 1)
    if '?' in db_name:
        db_name, query = db_name.split('?', 1)
    
    postgres_url = f"{base_url}/postgres"
    print(f"Connecting to {postgres_url} to verify database '{db_name}'...")
    
    conn = await asyncpg.connect(postgres_url)
    try:
        # Check if database exists
        exists = await conn.fetchval(
            "SELECT EXISTS (SELECT 1 FROM pg_database WHERE datname = $1)",
            db_name
        )
        if not exists:
            # Cannot run CREATE DATABASE in a transaction block
            # asyncpg connection execute auto-commits if not in a transaction
            print(f"Database '{db_name}' does not exist. Creating it...")
            await conn.execute(f"CREATE DATABASE {db_name};")
            print(f"Database '{db_name}' created successfully.")
        else:
            print(f"Database '{db_name}' already exists.")
    except Exception as e:
        print(f"Error checking/creating database: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(main())
