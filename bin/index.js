#!/usr/bin/env node

import { program } from "commander";
import { run } from "../src/commands/run.js";

program
  .version("1.0.0")
  .name("snapbug")
  .description("명령어 한 줄로 배포하고, 링크 하나로 팀원과 실시간으로 상태를 공유하세요!");

program
  .command("run")
  .description("디버깅 UI를 빌드하고 Vercel을 통해 배포합니다.")
  .option("--client-path <path>", "snapbug-client 경로", "../snapbug-client")
  .option("--deploy", "Vercel에 자동 배포합니다.", true)
  .action(async (options) => {
    await run({
      clientPath: options.clientPath,
      deploy: options.deploy !== false,
    });
  });

program
  .command("delete")
  .description("배포된 프로젝트를 삭제합니다.")
  .action(() => {
    console.log("배포된 프로젝트가 삭제되었습니다.");
  });

program.parse(process.argv);
