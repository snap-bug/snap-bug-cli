import path from "path";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

const config = {
  PUBLIC_DIR,
  STATE_FILE_NAME: "snapbug-state.json",
  USER_DEV_URL: "http://localhost:5173",
  API_SERVER_URL: "http://localhost:3001",
  API_SERVER_PORT: 3001,
  JSON_INDENTATION: 2,
  WAIT_TIME: 5000,
  STATE_FILE_PATH: path.join(PUBLIC_DIR, "snapbug-state.json"),
};

export default config;
