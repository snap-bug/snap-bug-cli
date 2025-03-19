import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { openBrowser, getReactPage } from "../puppeteer/browser.js";
import { trackStateChanges } from "../puppeteer/stateTracker.js";

const PID_FILE = path.join(process.cwd(), "snapbug.pid");
const packageJsonPath = path.join(process.cwd(), "package.json");

const startProjectServer = () => {
  if (!fs.existsSync(packageJsonPath)) {
    console.error("package.json을 찾을 수 없습니다.");

    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  if (!packageJson.scripts || !packageJson.scripts.dev) {
    console.error("package.json에 dev 스크립트가 없습니다.");

    return;
  }

  const serverProcess = spawn("npm", ["run", "dev"], { shell: true });

  try {
    fs.writeFile(PID_FILE, serverProcess.pid.toString(), "utf-8");
  } catch (err) {
    console.error("PID 파일 저장을 실패했습니다.", err);
  }

  serverProcess.on("error", (err) => {
    console.error("서버 실행 중 오류가 발생했습니다.:", err.message);
  });

  return serverProcess;
};

let isDebugging = false;

const startDebugging = async () => {
  if (isDebugging) return;
  isDebugging = true;

  console.log("React 상태 추적을 시작합니다...");

  const browser = await openBrowser();
  const page = await getReactPage(browser);

  if (!page) {
    await browser.close();

    isDebugging = false;
    return;
  }

  try {
    await trackStateChanges(page);
  } catch (err) {
    console.log("상태 추적 중 오류가 발생했습니다.", err);
  }

  return { browser, page };
};

const serverProcess = startProjectServer();

if (serverProcess) {
  startDebugging();

  serverProcess.on("exit", () => {
    console.log("서버 종료 감지: Puppeteer 브라우저를 닫습니다.");
    isDebugging = false;
  });
}

export default startDebugging;
