#!/usr/bin/env bash

set -e

defaultEnvironment='development'
ENVIRONMENT=${1:-$defaultEnvironment} 

case $ENVIRONMENT in
    production|preview|development) echo "The Environment \"${ENVIRONMENT}\" is valid.";;
    *) echo "The Environment \"${ENVIRONMENT}\" is invalid. It must be one of: <production | preview | development>"; exit;;
esac

function info {
  local msg=$1
  echo
  echo "${msg}"
}

# Could be per environment..
function getFromVault {
  local key=$1
  cat ../s3/s3-credentials.json | jq -r ".${key}"
}

function removeKey {
  local key=$1
  info "-= Removing key ${key} from environment ${ENVIRONMENT}"
  (echo 'y' | vercel env rm ${key} ${ENVIRONMENT}) || echo "Key was already removed"
}

function addKey {
  local key=$1
  local value=$2
  info "-= Adding key ${key} for environment ${ENVIRONMENT}"
  # echo "  ${value}" # don;t show secrets! just for debugging

  echo -n "${value}" | vercel env add "${key}" ${ENVIRONMENT}
}

info "-=-= Pushing credentials for ${ENVIRONMENT} environment"

removeKey 'ACCESS_KEY_ID'
removeKey 'SECRET_ACCESS_KEY'

addKey 'ACCESS_KEY_ID' $(getFromVault AccessKeyId)
addKey 'SECRET_ACCESS_KEY' $(getFromVault SecretAccessKey)

info "-=-= List credentials for ${ENVIRONMENT} environment"
vercel env ls ${ENVIRONMENT}

if [ "${ENVIRONMENT}" = "development" ]; then
  info "-=-= Pulling credentials (only for development environment)"
  vercel env pull .env.local
fi
