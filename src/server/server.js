import express from "express";
import WebSocket from "ws";
import fs from "fs";
import path from "path";
import { SOCKET_PORT, API_SERVER_PORT } from "../utils/config";

const app = express();
app.use(express.json());

const wss = new WebSocket.Server({ port: SOCKET_PORT });
const STATE_FILE = path.join(process.cwd(), "snapbug-state.json");
const JSON_INDENTATION = 2;

const INTERNAL_SERVER_ERROR = 500;
const clients = new Set();

app.post("/saveState", (req, res) => {
  const newState = req.body.state;
  let existingData = [];

  try {
    if (fs.existsSync(STATE_FILE)) {
      const fileData = fs.readFileSync(STATE_FILE, "utf-8");
      existingData = fileData ? JSON.parse(fileData) : [];
    }
  } catch (error) {
    console.error("상태 파일 읽기 오류:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ error: "파일 읽기 오류" });
  }

  existingData.push({ timestamp: new Date().toISOString(), state: newState });

  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(existingData, null, JSON_INDENTATION));
    console.log("상태 저장 완료:", newState);
    res.json({ message: "State saved" });
  } catch (error) {
    console.error("상태 파일 저장 오류:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ error: "파일 저장 오류" });
  }
});

wss.on("connection", (ws) => {
  console.log("클라이언트가 WebSocket에 연결되었습니다.");
  clients.add(ws);

  ws.on("message", (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.event === "state_update") {
        console.log("실시간 상태 업데이트:", parsed.data);

        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
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

app.listen(API_SERVER_PORT, () => console.log(`API 서버가 포트 ${API_SERVER_PORT}에서 실행 중...`));
console.log(`WebSocket 서버가 포트 ${SOCKET_PORT}에서 실행 중...`);
