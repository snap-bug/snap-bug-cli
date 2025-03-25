import { startServer } from "../server/server.js";

let isDebugging = false;

const startDebugging = async () => {
  if (isDebugging) return;
  isDebugging = true;

  console.log("API 서버를 실행합니다...");
  await startServer();

  console.log("React 상태 추적을 시작합니다...");
};

export default startDebugging;
