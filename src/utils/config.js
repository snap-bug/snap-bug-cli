import path from "path";

const config = {
  USER_DEV_URL: "http://localhost:5173",
  API_SERVER_PORT: 3001,
  JSON_INDENTATION: 2,
  WAIT_TIME: 5000,
  STATE_FILE_PATH: path.join(process.cwd(), "data", "snapbug-state.json"),
  PID_FILE_PATH: path.join(process.cwd(), "data", "snapbug.pid"),
};

export default config;
