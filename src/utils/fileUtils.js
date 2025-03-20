import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import config from "./config.js";

const STATE_FILE = path.resolve(config.STATE_FILE_PATH);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function saveStateToFile(newEntry) {
  try {
    let existingData = [];

    if (await fileExists(STATE_FILE)) {
      try {
        const fileData = await fs.readFile(STATE_FILE, "utf-8");

        existingData = fileData ? JSON.parse(fileData) : [];
      } catch (error) {
        console.error("파일 읽기를 실패했습니다.", error);
      }

      const lastEntry = existingData[existingData.length - 1];

      if (!newEntry.dom && lastEntry?.dom) {
        newEntry.dom = lastEntry.dom;
      }
    }

    newEntry.id = uuidv4();
    existingData.push(newEntry);

    await fs.writeFile(STATE_FILE, JSON.stringify(existingData, null, config.JSON_INDENTATION));
    console.log("파일 저장에 성공했습니다.", newEntry);

    return existingData;
  } catch (err) {
    console.error("파일 저장을 실패했습니다.", err);
  }
}

