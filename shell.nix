{ pkgs ? import (fetchTarball {
    # Pinned nixpkgs-unstable (2026-08) so both machines get identical
    # postgres/node versions — keeps pg_dump output restorable across machines.
    url = "https://github.com/NixOS/nixpkgs/archive/c27cdad491a991b11ed731760aa2ef8db0cb0410.tar.gz";
    sha256 = "1r58xn9xdka8bw710i431srl3dmy7dyrhd32rjv709f2mkb6m1ix";
  }) {} }:

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
    # 5432 is taken by the system-wide postgresql.service on this machine
    export PGPORT=5433

    # Drizzle-compatible connection string
    export DATABASE_URL="postgres://postgres:postgres@localhost:$PGPORT/dev_db"

    # Absolute path, captured at entry, so the helpers work from any directory
    export DUMPFILE="$PWD/db/dev_db.sql"

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
    pg_ctl -o "-k $PGSOCK -p $PGPORT" -l "$PGDATA/server.log" start

    # Create the target application database if it doesn't exist yet
    sleep 1
    if ! psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw dev_db; then
      echo "Creating database 'dev_db'..."
      createdb -h localhost -U postgres dev_db
    fi

    # Write the live database to db/dev_db.sql. Run this by hand when you want
    # the dump updated — nothing writes the file automatically, so a dump can
    # never race a git pull. Machine-local auth data stays out of the dump, and
    # a failed pg_dump leaves the existing file untouched.
    db-dump() {
      echo "Dumping database to db/dev_db.sql..."
      if pg_dump -h localhost -U postgres --clean --if-exists \
           --exclude-table-data=public.session \
           --exclude-table-data=public.verification \
           dev_db > "$DUMPFILE.tmp"; then
        mv "$DUMPFILE.tmp" "$DUMPFILE"
        echo "Wrote db/dev_db.sql"
      else
        echo "pg_dump failed; keeping existing dump"
        rm -f "$DUMPFILE.tmp"
        return 1
      fi
    }

    # Load db/dev_db.sql over the live database. The dump drops and recreates
    # every table, so this replaces whatever is there now.
    db-restore() {
      if [ ! -f "$DUMPFILE" ]; then
        echo "No db/dev_db.sql to restore"
        return 1
      fi
      echo "Restoring database from db/dev_db.sql..."
      if psql -h localhost -U postgres -d dev_db -v ON_ERROR_STOP=1 \
           --single-transaction -f "$DUMPFILE" > /dev/null; then
        echo "Restored."
      else
        echo "Restore failed; database left unchanged."
        return 1
      fi
    }

    # Auto-restore only into an empty database. If dev_db already holds tables,
    # the live data may be newer than the file, so leave it alone.
    PUBLIC_TABLES=$(psql -h localhost -U postgres -d dev_db -tAc \
      "select count(*) from information_schema.tables where table_schema = 'public'" 2>/dev/null)
    if [ -f "$DUMPFILE" ] && [ "$PUBLIC_TABLES" = "0" ]; then
      db-restore
    elif [ -f "$DUMPFILE" ]; then
      echo "dev_db already has tables — skipping auto-restore."
    fi

    # Stop Postgres on exit. Nothing is dumped here: run db-dump yourself.
    trap 'echo "Stopping PostgreSQL..."; pg_ctl stop -m fast' EXIT

    echo ""
    echo "⚡ Nix Development Environment Active ⚡"
    echo "------------------------------------"
    echo "Node.js version: $(node -v)"
    echo "PostgreSQL:      Running on localhost:$PGPORT"
    echo "Database URL:    $DATABASE_URL"
    echo "db-dump          Write the live database to db/dev_db.sql"
    echo "db-restore       Load db/dev_db.sql over the live database"
    echo "------------------------------------"
  '';
}
