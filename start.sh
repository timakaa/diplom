#!/bin/sh

echo "Applying database schema..."
pnpm db:push

echo "Starting application..."
exec "$@" 