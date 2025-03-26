import express from "express";
import cors from "cors";
import config from "../utils/config.js";
import httpStatusCode from "../utils/httpStatusCode.js";
import { getStateById, getStateHistory, saveStateToFile } from "../utils/fileUtils.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.get("/states", async (req, res) => {
  try {
    const stateHistory = await getStateHistory();

    return res.status(httpStatusCode.OK).json(stateHistory);
  } catch (err) {
    console.error("상태를 읽어오지 못했습니다.", err);
    return res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: "Internal Server Error" });
  }
});

app.get("/states/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const stateHistory = await getStateById(id);

    if (!stateHistory) {
      return res
        .status(httpStatusCode.NOT_FOUND)
        .json({ error: "해당 상태를 조회할 수 없습니다." });
    }

    return res.status(httpStatusCode.OK).json(stateHistory);
  } catch (err) {
    console.error("상태를 조회할 수 없습니다.", err);
    return res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: "Internal Server Error" });
  }
});

app.post("/states", async (req, res) => {
  try {
    const { timestamp, state, dom, styles } = req.body;

    if (!timestamp || !state) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ errorMessage: "Bad Request" });
    }

    const updatedHistory = await saveStateToFile({ timestamp, state, dom, styles });

    if (!updatedHistory) {
      return res.status(httpStatusCode.NOT_FOUND).json({ errorMessage: "저장할 상태가 없습니다" });
    }

    return res
      .status(httpStatusCode.CREATED)
      .json({ message: "상태 저장이 완료되었습니다.", data: updatedHistory });
  } catch (err) {
    console.error("상태 저장 오류가 생겼습니다.", err);
    return res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: "Internal Server Error" });
  }
});

export const startServer = async () => {
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(config.API_SERVER_PORT, () => {
        console.log(`API 서버가 포트 ${config.API_SERVER_PORT}에서 실행 중...`);
        resolve();
      });

      server.on("error", (err) => {
        console.error("서버 실행 중 오류 발생:", err);
        reject(err);
      });
    });
  } catch (err) {
    throw new Error("서버 실행에 실패했습니다.");
  }
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  startServer();
}
