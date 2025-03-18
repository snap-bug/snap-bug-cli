import puppeteer from "puppeteer";
import config from "../utils/config.js";

export const openBrowser = async () => {
  const browser = await puppeteer.launch({
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
