#!/usr/bin/env bash
# microCMS MCP Server 起動ラッパー。
#
# APIキーを .mcp.json に直書きしないための仕組み。
# .env.local（gitignore 済み）を唯一の秘密情報の置き場として読み、
# microcms-mcp-server が期待する環境変数名に詰め替えて起動する。
#
#   .env.local の MICROCMS_SERVICE_DOMAIN → MICROCMS_SERVICE_ID
#   .env.local の MICROCMS_API_KEY        → そのまま
#
# 入稿・更新をさせる場合は、書き込み権限を持つ MCP 専用APIキーを
# MICROCMS_MCP_API_KEY として .env.local に足す（あればそちらを優先）。
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
env_file="${repo_root}/.env.local"

if [[ ! -f "${env_file}" ]]; then
  echo "microcms-mcp: ${env_file} が見つかりません。.env.local.example を複製して設定してください。" >&2
  exit 1
fi

# KEY=VALUE 行だけを拾う（コメント・空行・不正行は無視）。値の前後のクォートは剥がす。
read_env() {
  local key="$1" line value
  line="$(grep -E "^[[:space:]]*${key}=" "${env_file}" | tail -n 1 || true)"
  [[ -z "${line}" ]] && return 0
  value="${line#*=}"
  value="${value%\"}"; value="${value#\"}"
  value="${value%\'}"; value="${value#\'}"
  printf '%s' "${value}"
}

service_id="$(read_env MICROCMS_SERVICE_DOMAIN)"
api_key="$(read_env MICROCMS_MCP_API_KEY)"
[[ -z "${api_key}" ]] && api_key="$(read_env MICROCMS_API_KEY)"

if [[ -z "${service_id}" || -z "${api_key}" ]]; then
  echo "microcms-mcp: MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が .env.local に設定されていません。" >&2
  exit 1
fi

export MICROCMS_SERVICE_ID="${service_id}"
export MICROCMS_API_KEY="${api_key}"

exec npx -y microcms-mcp-server@latest "$@"
