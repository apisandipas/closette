{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # 1. Packages included in the environment
  buildInputs = [
    pkgs.nodejs_24       # Node.js runtime (bundles npm)
    pkgs.postgresql_16   # Postgres server and CLI tools (psql)
  ];

  # 2. Environment variables needed for Drizzle and Postgres
  shellHook = ''
    # Define local data and socket directories inside the project
    export PGDATA="$PWD/.direnv/postgres"
    export PGSOCK="$PWD/.direnv/postgres_sockets"
    
    # Drizzle-compatible connection string
    export DATABASE_URL="postgres://postgres:postgres@localhost:5432/dev_db"

    # Ensure local directory paths exist
    mkdir -p "$PGDATA"
    mkdir -p "$PGSOCK"

    # Initialize the database cluster if it doesn't exist
    if [ ! -d "$PGDATA/base" ]; then
      echo "Initializing PostgreSQL database..."
      initdb --auth=trust --no-locale -U postgres
      
      # Configure Postgres to use our isolated socket directory
      echo "unix_socket_directories = '$PGSOCK'" >> "$PGDATA/postgresql.conf"
    fi

    # Start PostgreSQL locally on shell entry
    echo "Starting PostgreSQL..."
    pg_ctl -o "-k $PGSOCK" -l "$PGDATA/server.log" start

    # Create the target application database if it doesn't exist yet
    sleep 1
    if ! psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw dev_db; then
      echo "Creating database 'dev_db'..."
      createdb -h localhost -U postgres dev_db
    fi

    # Restore from the committed dump so test data stays consistent across machines
    DUMPFILE="$PWD/db/dev_db.sql"
    if [ -f "$DUMPFILE" ]; then
      echo "Restoring database from db/dev_db.sql..."
      psql -h localhost -U postgres -d dev_db -f "$DUMPFILE" > /dev/null
    fi

    # Dump the database and stop Postgres automatically when exiting the Nix shell
    trap 'echo "Dumping database to db/dev_db.sql..."; \
          mkdir -p "$PWD/db"; \
          pg_dump -h localhost -U postgres --clean --if-exists dev_db > "$PWD/db/dev_db.sql"; \
          echo "Stopping PostgreSQL..."; pg_ctl stop -m fast' EXIT

    echo ""
    echo "⚡ Nix Development Environment Active ⚡"
    echo "------------------------------------"
    echo "Node.js version: $(node -v)"
    echo "PostgreSQL:      Running on localhost:5432"
    echo "Database URL:    $DATABASE_URL"
    echo "------------------------------------"
  '';
}