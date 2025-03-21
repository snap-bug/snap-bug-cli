import { openBrowser, getReactPage } from "../puppeteer/browser.js";
import { trackStateChanges } from "../puppeteer/stateTracker.js";
import { startServer } from "../server/server.js";

let isDebugging = false;

const startDebugging = async () => {
  if (isDebugging) return;
  isDebugging = true;

  console.log("API 서버를 실행합니다...");
  await startServer();

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
    console.error("상태 추적 중 오류가 발생했습니다.", err);
  }
};

export default startDebugging;
