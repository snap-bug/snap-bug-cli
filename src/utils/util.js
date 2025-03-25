import { spawn } from "child_process";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const runCommand = (cmd, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} 종료 코드 : ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(new Error(`${cmd} 실행 실패: ${err.message}`));
    });
  });
};
