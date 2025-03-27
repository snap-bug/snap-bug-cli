import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { runCommand } from "../utils/util.js";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const require = createRequire(import.meta.url);

const exitWithError = (message) => {
  console.error(`${message}`);
  process.exit(1);
};

async function ensureClientInstalled() {
  try {
    require.resolve("snap-bug-client/package.json", {
      paths: [path.resolve(__dirname, "../../node_modules")],
    });

    return;
  } catch {
    console.log("snap-bug-client가 설치되지 않았습니다. 자동 설치를 진행합니다...");

    try {
      await runCommand("npm", ["install", "snap-bug-client"], {
        cwd: path.resolve(__dirname, "../../"),
      });
    } catch (err) {
      exitWithError(`snap-bug-client 설치 실패: ${err.message}`);
    }
  }
}

export async function run({ deploy }) {
  await ensureClientInstalled();

  let clientPath;
  try {
    const cliNodeModules = path.resolve(__dirname, "../../node_modules");
    const resolved = require.resolve("snap-bug-client/package.json", {
      paths: [cliNodeModules],
    });

    clientPath = path.dirname(resolved);
  } catch {
    exitWithError("snap-bug-client 패키지 경로를 찾을 수 없습니다.");
  }

  const distPath = path.join(clientPath, "dist");
  const localStatePath = path.resolve(__dirname, "../../public/snapbug-state.json");
  const distStatePath = path.join(distPath, "snapbug-state.json");

  if (!existsSync(localStatePath)) {
    exitWithError(
      "상태 추적 데이터(snapbug-state.json)가 없습니다. 먼저 상태 기록을 실행해주세요."
    );
  }

  try {
    const vitePath = path.join(clientPath, "node_modules", ".bin", "vite");

    console.log("디버깅 UI 빌드 중...");

    if (!existsSync(vitePath)) {
      console.warn("vite가 설치되지 않았습니다. 의존성을 설치합니다...");
      await runCommand("npm", ["install"], { cwd: clientPath });
      await runCommand("npm", ["run", "build"], { cwd: clientPath });
      console.log("빌드 완료!");
    }
  } catch (err) {
    exitWithError(`빌드 실패: ${err.message}`);
  }

  try {
    await fs.copyFile(localStatePath, distStatePath);
    console.log("상태 JSON 복사 완료:", distStatePath);
  } catch (err) {
    exitWithError(`상태 JSON 복사 실패: ${err.message}`);
  }

  if (deploy) {
    const token = process.env.VERCEL_TOKEN;
    if (!token) exitWithError("VERCEL_TOKEN 환경변수가 필요합니다.");

    try {
      console.log("Vercel 배포 중...");

      const result = await runCommand(
        "npx",
        ["vercel", "deploy", "--prod", "--yes", `--token=${token}`],
        { cwd: distPath }
      );

      const match = result.match(/https:\/\/.*\.vercel\.app/);
      const url = match?.[0];
      if (!url) throw new Error("배포 URL을 찾을 수 없습니다.");

      console.log(`🎉 배포 완료: ${url}`);
    } catch (err) {
      exitWithError(`배포 실패: ${err.message}`);
    }
  }
}
