#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1-}" ]; then
  echo "Usage: $0 <keystore-path>"
  echo "Example: $0 lazycat.keystore"
  exit 2
fi
KS="$1"
echo "Generating keystore at $KS"
keytool -genkeypair -v -keystore "$KS" -alias lazycat -keyalg RSA -keysize 2048 -validity 10000
echo "Keystore created: $KS"
echo "To upload to GitHub Secrets as base64 run:"
echo "  base64 -w0 $KS | gh secret set KEYSTORE_BASE64"
