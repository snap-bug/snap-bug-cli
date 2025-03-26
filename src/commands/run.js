import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { runCommand } from "../utils/util.js";
import { createSampleSnapbugData } from "../utils/fileUtils.js";

export async function run({ deploy, clientPath }) {
  if (!clientPath) {
    console.error("--client-path 옵션이 필요합니다.");
    process.exit(1);
  }

  const absClientPath = path.resolve(clientPath);
  const DATA_PATH = path.resolve(process.cwd(), "snapbug-data.json");
  const targetJsonPath = path.join(absClientPath, "public", "snapbug-data.json");

  if (!existsSync(absClientPath)) {
    console.error(`clientPath 경로가 존재하지 않습니다: ${absClientPath}`);
    process.exit(1);
  }

  if (deploy && !process.env.VERCEL_TOKEN) {
    console.error("VERCEL_TOKEN 환경변수가 필요합니다.");
    process.exit(1);
  }

  if (!existsSync(DATA_PATH)) {
    console.warn("snapbug-data.json 파일이 없어 생성합니다.");
    await createSampleSnapbugData(DATA_PATH);
  }

  try {
    await fs.mkdir(path.dirname(targetJsonPath), { recursive: true });

    await fs.copyFile(DATA_PATH, targetJsonPath);
    console.log("상태 데이터 복사 완료:", targetJsonPath);

    console.log("의존성 설치 중 입니다...");
    await runCommand("npm", ["install"], { cwd: absClientPath });

    console.log("디버깅 UI 빌드 중 입니다...");
    await runCommand("npm", ["run", "build"], { cwd: absClientPath });

    console.log("빌드 완료!");

    if (deploy) {
      const distPath = path.join(absClientPath, "dist");
      await deployToVercel(distPath);
    }

    console.log("🎉 프로젝트가 배포되었습니다. URL: [URL]");
  } catch (err) {
    console.error("실행 중 에러 발생: ", err.message);
    process.exit(1);
  }
}

async function deployToVercel(distPath) {
  console.log("Vercel에 배포 중...");

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("VERCEL_TOKEN 환경변수가 필요합니다.");
    process.exit(1);
  }

  try {
    await runCommand("npx", ["vercel", "deploy", "--prod", "--yes", `--token=${token}`], {
      cwd: distPath,
    });

    console.log("Vercel 배포 완료");
  } catch (err) {
    console.error("배포 실패:", err.message);
    process.exit(1);
  }
}
