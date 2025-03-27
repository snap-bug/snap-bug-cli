import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { runCommand } from "../utils/util.js";
import { createSampleSnapbugData } from "../utils/fileUtils.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export async function run({ deploy }) {
  const clientPkg = "snapbug-client-ui";
  const clientPath = path.resolve("node_modules", clientPkg);
  const DATA_PATH = path.resolve("snapbug-data.json");
  const targetJsonPath = path.join(clientPath, "public", "snapbug-data.json");

  if (!existsSync(clientPath)) {
    console.log(`📦 ${clientPkg} 패키지 설치 중...`);
    await runCommand("npm", ["install", clientPkg]);
  }

  if (!existsSync(DATA_PATH)) {
    console.warn("snapbug-data.json 파일이 없어 생성합니다.");
    await createSampleSnapbugData(DATA_PATH);
  }

  try {
    await fs.mkdir(path.dirname(targetJsonPath), { recursive: true });
    await fs.copyFile(DATA_PATH, targetJsonPath);
    console.log("상태 데이터 복사 완료:", targetJsonPath);
  } catch (err) {
    console.error("데이터 복사 중 에러 발생:", err.message);
    process.exit(1);
  }

  try {
    console.log("디버깅 UI 빌드 중 입니다...");
    await runCommand("npm", ["install"], { cwd: clientPath });
    await runCommand("npm", ["run", "build"], { cwd: clientPath });
    console.log("빌드 완료!");
  } catch (err) {
    console.error("빌드 실패:", err.message);
    process.exit(1);
  }

  if (deploy) {
    const distPath = path.join(clientPath, "dist");
    const token = process.env.VERCEL_TOKEN;

    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
    if (!token) {
      console.error("VERCEL_TOKEN 환경변수가 필요합니다.");
      process.exit(1);
    }

    try {
      console.log("Vercel 배포 중...");
      const result = await runCommand(
        "npx",
        ["vercel", "deploy", "--prod", "--yes", `--token=${token}`],
        { cwd: distPath }
      );

      const match = result.match(/https:\/\/.*\.vercel\.app/);
      if (!match?.[0]) {
        throw new Error("배포 URL 파싱에 실패했습니다.");
      }

      console.log(`🎉 프로젝트가 배포되었습니다: ${match[0]}`);
    } catch (err) {
      console.error("배포 실패:", err.message);
      process.exit(1);
    }
  }
}
