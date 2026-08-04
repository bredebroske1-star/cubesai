#!/usr/bin/env bash
set -euo pipefail

if [ ! -f "${1-}" ]; then
  echo "Usage: $0 <keystore-path>"
  exit 2
fi
KS="$1"
echo "Uploading secrets via gh CLI (you must be authenticated)."
echo "Setting KEYSTORE_BASE64..."
base64 -w0 "$KS" | gh secret set KEYSTORE_BASE64
read -sp "Enter KEYSTORE_PASSWORD: " KP; echo; gh secret set KEYSTORE_PASSWORD --body "$KP"
read -p "Enter KEY_ALIAS (default: lazycat): " KA; KA=${KA:-lazycat}; gh secret set KEY_ALIAS --body "$KA"
read -sp "Enter KEY_PASSWORD: " KPW; echo; gh secret set KEY_PASSWORD --body "$KPW"
echo "Remember to add PLAY_SERVICE_ACCOUNT_JSON using: gh secret set PLAY_SERVICE_ACCOUNT_JSON --body \"$(cat service-account.json)\""
