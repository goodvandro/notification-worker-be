#!/usr/bin/env sh

# wait-for-redis.sh
# Aguarda até que o host e porta do Redis estejam disponíveis antes de continuar.

set -e

host="$1"
port="$2"
shift 2

echo "⏳ Aguardando Redis em ${host}:${port}..."

while ! nc -z "$host" "$port"; do
  sleep 0.3
done

echo "✅ Redis está pronto em ${host}:${port}! Executando comando: $*"
exec "$@"