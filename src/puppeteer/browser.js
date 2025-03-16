import puppeteer from "puppeteer";

export const openBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  return browser;
};
