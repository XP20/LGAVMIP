import { spawn } from "bun";

async function run() {
  const procServe = spawn(["bun", "run", "serve"]);

  await new Promise(resolve => setTimeout(resolve, 1000));

  const procTest = spawn(["bun", "test"]);

  await Promise.all([procServe, procTest]);
}

run();
