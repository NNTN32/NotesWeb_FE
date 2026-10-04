#!/bin/sh
set -eu

# Only an origin is accepted; /api paths are forwarded without rewriting.
if ! printf '%s' "${API_UPSTREAM:-}" | grep -Eq '^https?://[A-Za-z0-9.-]+(:[0-9]+)?$'; then
  echo >&2 'Set API_UPSTREAM to a backend origin, e.g. http://notes-app:8081 (no trailing slash or path).'
  exit 1
fi
