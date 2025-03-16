import puppeteer from "puppeteer";

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
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    return page;
  } catch (error) {
    console.error("개발 서버에 접속할 수 없습니다.", error);
  }

  return page;
};
