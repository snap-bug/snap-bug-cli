import express from "express";
import path from "path";
import fs from "fs/promises";
import { WebSocketServer } from "ws";
import config from "../utils/config.js";

const app = express();
app.use(express.json());

const wss = new WebSocketServer({ port: config.SOCKET_PORT });
const STATE_FILE = path.join(process.cwd(), "snapbug-state.json");

const clients = new Set();

async function saveStateToFile(state) {
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

wss.on("connection", (ws) => {
  console.log("클라이언트가 WebSocket에 연결되었습니다.");
  clients.add(ws);

  ws.on("message", async (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.event === "state_update") {
        console.log("실시간 상태 업데이트:", parsed.data);

        await saveStateToFile(parsed.data);

        clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ event: "state_update", data: parsed.data }));
          }
        });
      }
    } catch (error) {
      console.error("WebSocket 메시지 처리 오류:", error);
    }
  });

  ws.on("close", () => {
    console.log("클라이언트 연결이 종료되었습니다.");
    clients.delete(ws);
  });
});

app.listen(config.API_SERVER_PORT, () =>
  console.log(`API 서버가 포트 ${config.API_SERVER_PORT}에서 실행 중...`)
);
console.log(`WebSocket 서버가 포트 ${config.SOCKET_PORT}에서 실행 중...`);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
