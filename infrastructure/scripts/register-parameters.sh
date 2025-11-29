#!/bin/bash

set -euo pipefail

function usage() {
  echo "Usage: $0 <environment> [aws-cli-args...]"
  exit 1
}

if [ "$#" -lt 1 ]; then
  usage
fi

env="$1"
shift
args=("${@:-}")

echo "Registering parameters for environment: $env"

function register_parameter() {
  local name=$1
  local value=$2
  local type=${3:-SecureString}

  echo "Registering parameter: $name with type: $type"

  aws ssm put-parameter \
    --name "$name" \
    --value "$value" \
    --type "$type" \
    --overwrite \
    "${args[@]}" > /dev/null
}

register_parameter "/kanaru.me-v2/$env/jwt-secret" "$(openssl rand -base64 32)"
register_parameter "/kanaru.me-v2/$env/initial-bearer-token" "$(openssl rand -base64 64)"
