import { spawn } from "child_process";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const runCommand = (cmd, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    let output = "";

    const child = spawn(cmd, args, {
      shell: true,
      stdio: "pipe",
      ...options,
    });

    if (child.stdout) {
      child.stdout.on("data", (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (data) => {
        process.stderr.write(data);
      });
    }

    child.on("exit", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`${cmd} 종료 코드 : ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(new Error(`${cmd} 실행 실패: ${err.message}`));
    });
  });
};
