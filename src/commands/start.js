import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const packageJsonPath = path.join(process.cwd(), "package.json");

const startProjectServer = () => {
  if (!fs.existsSync(packageJsonPath)) {
    console.error("package.json을 찾을 수 없습니다.");

    return;
  } else {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    if (!packageJson.scripts || !packageJson.scripts.dev) {
      console.error("package.json에 dev 스크립트가 없습니다.");

      return;
    }

    const serverProcess = spawn("npm", ["run", "dev"], { shell: true });

    serverProcess.on("error", (err) => {
      console.error("서버실행 중 오류가 발생했습니다.", err.message);
    });
  }
};

export default startProjectServer;
