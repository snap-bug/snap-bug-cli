import { closeBrowser } from "../puppeteer/browser.js";

export const stopDebugging = async () => {
  closeBrowser();
};
