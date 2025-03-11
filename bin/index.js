#!/usr/bin/env node

import { program } from "commander";

program
  .version("1.0.0")
  .name("snapbug");

program.parse(process.argv);
