import fs from "fs/promises";
import path from "path";

const PID_FILE = path.join(process.cwd(), "snapbug.pid");

export const stopDebugging = async () => {
  try {
    await fs.access(PID_FILE);
    const pid = parseInt((await fs.readFile(PID_FILE, "utf-8")).trim(), 10);

    process.kill(pid);
    await fs.unlink(PID_FILE);

    console.log("프로세스를 종료했습니다.");
  } catch (err) {
    console.error("프로세스 종료에 실패했습니다.", err.message);
  }
};
