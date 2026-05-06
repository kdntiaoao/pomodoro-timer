/**
 * @file git worktree 作成 + pnpm install を一括実行する setup script
 * @example pnpm dlx tsx tools/worktree-setup.ts <branch-name>
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const branch = process.argv[2];
if (!branch) {
  console.error("Usage: pnpm dlx tsx tools/worktree-setup.ts <branch-name>");
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

if (fs.existsSync(worktreeDir)) {
  console.error(`Target directory already exists: ${worktreeDir}`);
  process.exit(1);
}

/** branch の存在判定 */
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

// 既存 branch なら attach, 無ければ新規作成
const worktreeAddArgs = branchExists()
  ? ["worktree", "add", worktreeDir, branch]
  : ["worktree", "add", "-b", branch, worktreeDir];

const worktreeAddResult = spawnSync("git", worktreeAddArgs, {
  stdio: "inherit",
});
if (worktreeAddResult.error) {
  console.error(`Failed to spawn git: ${worktreeAddResult.error.message}`);
  process.exit(1);
}
if (worktreeAddResult.signal) {
  console.error(`git terminated by signal ${worktreeAddResult.signal}`);
  process.exit(128);
}
if (worktreeAddResult.status !== 0) {
  process.exit(worktreeAddResult.status ?? 1);
}

// 運用で必要な gitignored file をここに列挙 (例: ".env.local")
const copyTargets: string[] = [
  // ".env.local",
];

/**
 * ファイル / ディレクトリを worktree にコピー
 * @param relPath repoRoot 起点の相対 path
 * @throws src 不在時
 */
const copyTarget = (relPath: string) => {
  const src = path.join(repoRoot, relPath);
  const dest = path.join(worktreeDir, relPath);

  if (!fs.existsSync(src)) {
    throw new Error(`Missing source path: ${relPath}`);
  }

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✔ Copied directory: ${relPath}`);
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`✔ Copied file: ${relPath}`);
};

for (const relPath of copyTargets) {
  copyTarget(relPath);
}

const installResult = spawnSync("pnpm", ["install", "--frozen-lockfile"], {
  cwd: worktreeDir,
  stdio: "inherit",
});

const installFailed =
  Boolean(installResult.error) ||
  Boolean(installResult.signal) ||
  installResult.status !== 0;

if (installFailed) {
  if (installResult.error) {
    console.error(`Failed to spawn pnpm: ${installResult.error.message}`);
  }
  if (installResult.signal) {
    console.error(`pnpm terminated by signal ${installResult.signal}`);
  }
  console.error("pnpm install failed → rolling back worktree");
  spawnSync("git", ["worktree", "remove", "--force", worktreeDir], {
    stdio: "inherit",
  });
  process.exit(installResult.status ?? 1);
}

console.log(`✅ worktree ready: ${worktreeDir}`);
