import fs from "fs/promises";
import config from "../utils/config.js";

export const stopDebugging = async () => {
  try {
    await fs.access(config.PID_FILE_PATH);
    const pid = parseInt((await fs.readFile(config.PID_FILE_PATH, "utf-8")).trim(), 10);

    process.kill(pid);
    await fs.unlink(config.PID_FILE_PATH);

    console.log("프로세스를 종료했습니다.");
  } catch (err) {
    console.error("프로세스 종료에 실패했습니다.", err.message);
  }
};
