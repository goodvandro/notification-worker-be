#!/usr/bin/env sh

# wait-for-rabbit.sh
# Aguarda até que o host e porta do RabbitMQ estejam disponíveis.

set -e

host="$1"
port="$2"
shift 2

echo "⏳ Aguardando RabbitMQ em ${host}:${port}..."

while ! nc -z "$host" "$port"; do
  sleep 0.3
done

echo "✅ RabbitMQ está pronto em ${host}:${port}! Executando comando: $*"
exec "$@"