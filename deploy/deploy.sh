#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh ghcr.io/OWNER/archai:latest
IMAGE=${1:-ghcr.io/${GITHUB_OWNER:-your-org}/archai:latest}
CONTAINER_NAME=${2:-archai}

echo "Pulling image $IMAGE"
docker pull "$IMAGE"

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Removing existing container $CONTAINER_NAME"
  docker rm -f "$CONTAINER_NAME" || true
fi

echo "Starting container $CONTAINER_NAME"
docker run -d --name "$CONTAINER_NAME" \
  -p 127.0.0.1:8000:8000 \
  --restart unless-stopped \
  -e ALLOWED_ORIGINS="https://archaiweb2026.loca.lt" \
  "$IMAGE"

echo "Deployment complete. Application listening on 127.0.0.1:8000"
