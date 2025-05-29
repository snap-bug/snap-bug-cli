import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import config from "./config.js";

const STATE_FILE = path.resolve(config.PUBLIC_DIR, config.STATE_FILE_NAME);

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
    let dataToSave = [];
    let existingData = [];

    if (await fileExists(STATE_FILE)) {
      const fileData = await fs.readFile(STATE_FILE, "utf-8");
      existingData = fileData ? JSON.parse(fileData) : [];
    }

    const isFirstRecord = existingData.length === 0;

    if (isFirstRecord) {
      console.log("상태 기록 시작합니다.");
      dataToSave = [newEntry];
    } else {
      const lastEntry = existingData[existingData.length - 1];
      if (!newEntry.dom && lastEntry?.dom) {
        newEntry.dom = lastEntry.dom;
      }

      dataToSave = [...existingData, newEntry];
    }

    newEntry.id = uuidv4();

    await fs.writeFile(STATE_FILE, JSON.stringify(dataToSave, null, config.JSON_INDENTATION));
    console.log("파일 저장에 성공했습니다.", newEntry);

    return dataToSave;
  } catch (err) {
    console.error("파일 저장을 실패했습니다.", err);
  }
}

export async function getStateHistory() {
  try {
    if (!(await fileExists(STATE_FILE))) return [];

    const fileData = await fs.readFile(STATE_FILE, "utf-8");
    try {
      return fileData ? JSON.parse(fileData) : [];
    } catch (err) {
      console.error("파일 상태를 확인해주세요.", err);
      return [];
    }
  } catch (err) {
    console.error("상태 파일 조회 오류");
    return [];
  }
}

export async function getStateById(id) {
  try {
    const stateHistory = await getStateHistory();

    return stateHistory.find((history) => history.id === id) || null;
  } catch (err) {
    console.error("상태를 조회할 수 없습니다.", err);
    return null;
  }
}

export async function createSampleSnapbugData(path = STATE_FILE) {
  await writeFile(path, "[]", "utf-8");

  console.log(`기본 snapbug-state 파일 생성 완료: ${path}`);
}
