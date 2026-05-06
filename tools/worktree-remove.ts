/**
 * @file git worktree 削除 + branch 削除を一括実行する teardown script
 * @example pnpm dlx tsx tools/worktree-remove.ts <branch-name>
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const branch = process.argv[2];
if (!branch) {
  console.error("Usage: pnpm dlx tsx tools/worktree-remove.ts <branch-name>");
  process.exit(1);
}

const repoRootResult = spawnSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
});
if (repoRootResult.error) {
  console.error(`Failed to spawn git: ${repoRootResult.error.message}`);
  process.exit(1);
}
if (repoRootResult.status !== 0) {
  console.error("Failed to resolve git repo root");
  if (repoRootResult.stderr) {
    console.error(repoRootResult.stderr.trim());
  }
  process.exit(repoRootResult.status ?? 1);
}
const repoRoot = repoRootResult.stdout.trim();

const repoName = path.basename(repoRoot);
const parentDir = path.dirname(repoRoot);
const safeBranch = branch.replace(/[\\/\s]+/g, "-").replace(/^-+|-+$/g, "");
const worktreeDir = path.join(parentDir, `${repoName}-${safeBranch}`);

/** ローカル branch の存在判定 */
const branchExists = () => {
  const result = spawnSync(
    "git",
    ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`],
    {
      stdio: "ignore",
    },
  );
  return result.status === 0;
};

/**
 * branch tip の short SHA を取得
 * @returns 取得失敗時 null
 */
const getBranchSha = () => {
  const result = spawnSync(
    "git",
    ["rev-parse", "--short", `refs/heads/${branch}`],
    {
      encoding: "utf8",
    },
  );
  return result.status === 0 ? result.stdout.trim() : null;
};

// 削除前バリデーション (worktree dir + branch 両方を upfront で確認)
if (!fs.existsSync(worktreeDir)) {
  console.error(`Target directory does not exist: ${worktreeDir}`);
  process.exit(1);
}
if (!branchExists()) {
  console.error(`Branch does not exist: ${branch}`);
  process.exit(1);
}

// recovery hint 用に tip SHA を事前取得
const tipSha = getBranchSha();

// worktree 削除 (dirty 時は git が refuse → 手動 cleanup 後に再実行)
const removeResult = spawnSync("git", ["worktree", "remove", worktreeDir], {
  stdio: "inherit",
});
if (removeResult.error) {
  console.error(`Failed to spawn git: ${removeResult.error.message}`);
  process.exit(1);
}
if (removeResult.signal) {
  console.error(`git terminated by signal ${removeResult.signal}`);
  process.exit(128);
}
if (removeResult.status !== 0) {
  process.exit(removeResult.status ?? 1);
}

// branch 削除 (unmerged 時は git が refuse → merge / push 確認後に手動 -D)
const deleteResult = spawnSync("git", ["branch", "-d", branch], {
  stdio: "inherit",
});
if (deleteResult.error) {
  console.error(`Failed to spawn git: ${deleteResult.error.message}`);
  process.exit(1);
}
if (deleteResult.signal) {
  console.error(`git terminated by signal ${deleteResult.signal}`);
  process.exit(128);
}
if (deleteResult.status !== 0) {
  process.exit(deleteResult.status ?? 1);
}

console.log(`✅ worktree removed: ${worktreeDir}`);
console.log(
  tipSha
    ? `✅ branch deleted: ${branch} (was ${tipSha}, recover: git branch ${branch} ${tipSha})`
    : `✅ branch deleted: ${branch}`,
);
