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
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  return page;
};
