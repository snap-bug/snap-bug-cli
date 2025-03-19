import express from "express";
import path from "path";
import fs from "fs/promises";
import config from "../utils/config.js";

const app = express();
app.use(express.json());

const STATE_FILE = path.join(process.cwd(), "snapbug-state.json");

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function saveStateToFile(state) {
  try {
    let existingData = [];

    if (await fileExists(STATE_FILE)) {
      try {
        const fileData = await fs.readFile(STATE_FILE, "utf-8");
        existingData = fileData ? JSON.parse(fileData) : [];
      } catch (error) {
        console.error("상태 파일 읽기 오류:", error);
      }
    } else {
      console.log("📁 상태 파일이 존재하지 않습니다. 새로 생성합니다.");
      await fs.writeFile(STATE_FILE, JSON.stringify([], null, config.JSON_INDENTATION));
    }

    existingData.push({ timestamp: new Date().toISOString(), state });

    await fs.writeFile(STATE_FILE, JSON.stringify(existingData, null, config.JSON_INDENTATION));
    console.log("상태 저장 완료:", state);
  } catch (error) {
    console.error("상태 파일 저장 오류:", error);
  }
}

app.listen(config.API_SERVER_PORT, () =>
  console.log(`API 서버가 포트 ${config.API_SERVER_PORT}에서 실행 중...`)
);
