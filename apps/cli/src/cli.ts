import { log } from "console";
import { printTitle } from "./lib/utils";
import promptSync from "prompt-sync";

const prompt = promptSync({
  sigint: true,
});

function main() {
  printTitle();

  while (true) {
    const result = prompt("Enter a command: ");
    log(result);
  }
}

main();
