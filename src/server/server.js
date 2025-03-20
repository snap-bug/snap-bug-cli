import express from "express";
import cors from "cors";
import config from "../utils/config.js";
import httpStatusCode from "../utils/httpStatusCode.js";
import { getStateById, getStateHistory, saveStateToFile } from "../utils/fileUtils.js";

const app = express();
app.use(express.json());
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


app.post("/states", async (req, res) => {
  try {
    const { timestamp, state, dom } = req.body;

    if (!timestamp || !state) {
      return res.status(httpStatusCode.BAD_REQUEST).json({ errorMessage: "Bad Request" });
    }

    const updatedHistory = await saveStateToFile({ timestamp, state, dom });

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

app.listen(config.API_SERVER_PORT, () =>
  console.log(`API 서버가 포트 ${config.API_SERVER_PORT}에서 실행 중...`)
);
