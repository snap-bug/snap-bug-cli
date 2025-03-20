import puppeteer from "puppeteer";
import config from "../utils/config.js";

let browser = null;

export const openBrowser = async () => {
  if (browser) {
    console.log("브라우저가 이미 실행 중입니다.");
    return browser;
  }

  browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  return browser;
};

export const getReactPage = async (browser) => {
  const page = await browser.newPage();

  try {
    await page.goto(config.USER_DEV_URL, { waitUntil: "networkidle0" });

    return page;
  } catch (error) {
    console.error("개발 서버에 접속할 수 없습니다.", error);
  }

  return page;
};

export const closeBrowser = async () => {
  if (browser) {
    console.log("디버깅 모드를 종료합니다.");

    await browser.close();
    browser = null;
    console.log("브라우저가 종료되었습니다.");
  } else {
    console.log("현재 디버깅 모드가 아닙니다.");
  }
};
