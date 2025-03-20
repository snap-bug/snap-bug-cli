#!/usr/bin/env node

import { program } from "commander";
import startDebugging from "../src/commands/start.js";

program
  .version("1.0.0")
  .name("snapbug")
  .description("명령어 한 줄로 배포하고, 링크 하나로 팀원과 실시간으로 상태를 공유하세요!");

program
  .command("start")
  .description("디버깅 모드를 시작합니다. 상태 기록을 활성화합니다.")
  .action(async () => {
    await startDebugging();
    console.log("상태 기록 중 입니다.");
  });

program
  .command("end")
  .description("디버깅 모드를 종료합니다. 상태 기록을 중단합니다.")
  .action(async () => {
    await startDebugging();
    console.log("상태 기록을 중단했습니다.");
  });

program
  .command("run")
  .description("현재 프로젝트를 Vercel를 통해 배포합니다.")
  .action(() => {
    console.log("프로젝트가 배포되었습니다. URL: [URL]");
  });

program
  .command("delete")
  .description("배포된 프로젝트를 삭제합니다.")
  .action(() => {
    console.log("배포된 프로젝트가 삭제되었습니다.");
  });

program.parse(process.argv);
