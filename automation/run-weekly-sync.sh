#!/bin/zsh
# 每周一自动收集 Amex MR 转点信息并更新仓库。
# 由 launchd (com.amex-mr.weekly-sync) 每周一 10:00 触发。
# 手动测试：./automation/run-weekly-sync.sh

set -uo pipefail

REPO="/Users/bytedance/amex-mr-calculate"
PROMPT_FILE="$REPO/automation/collect-prompt.md"
LOG_DIR="$REPO/logs"
TS="$(date +%Y-%m-%d_%H%M%S)"
LOG="$LOG_DIR/weekly-sync_$TS.log"

# 让 launchd 环境能找到 node / git / claude
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

mkdir -p "$LOG_DIR" "$REPO/automation/reports"
cd "$REPO" || { echo "cannot cd $REPO" >&2; exit 1; }

{
  echo "=== Amex MR weekly sync @ $TS ==="
  echo "node: $(command -v node)  git: $(command -v git)  claude: $(command -v claude)"

  # 启动一个 Claude Code 实例，非交互执行收集+更新任务
  claude -p "$(cat "$PROMPT_FILE")" \
    --model sonnet \
    --permission-mode bypassPermissions \
    --add-dir "$REPO"

  echo "=== exit code: $? ==="
  echo "=== done @ $(date +%Y-%m-%d_%H%M%S) ==="
} >> "$LOG" 2>&1

# 只保留最近 12 份日志
ls -1t "$LOG_DIR"/weekly-sync_*.log 2>/dev/null | tail -n +13 | xargs rm -f 2>/dev/null || true
