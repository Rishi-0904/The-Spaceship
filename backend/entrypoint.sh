#!/bin/sh
set -e

echo "Waiting for PostgreSQL database to be ready..."
until python -c "
import asyncio, asyncpg, os
from dotenv import load_dotenv
load_dotenv()
url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/postgres').rsplit('/', 1)[0] + '/postgres'
async def check():
    try:
        conn = await asyncpg.connect(url, timeout=3)
        await conn.close()
        return True
    except Exception:
        return False
exit(0 if asyncio.run(check()) else 1)
" 2>/dev/null; do
    echo "PostgreSQL is unavailable - sleeping 2 seconds..."
    sleep 2
done

echo "PostgreSQL is up! Initializing database and running ingestion..."
python scripts/create_db.py
python scripts/ingest.py

echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
